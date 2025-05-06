import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { productsService } from '../../services/api/products.service';
import { debounce } from '../../lib/utils';

interface ProductSearchProps {
  onSelect?: (product: Product) => void;
  excludeIds?: string[];
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSelect,
  excludeIds = [],
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const products = await productsService.searchProducts(searchQuery);
      setResults(products.filter(p => !excludeIds.includes(p.id)));
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchProducts, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {(results.length > 0 || isLoading) && (
        <Card className="absolute z-10 w-full mt-1 shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              <ul className="max-h-60 overflow-auto">
                {results.map((product) => (
                  <li
                    key={product.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3"
                      onClick={() => {
                        onSelect?.(product);
                        setQuery('');
                        setResults([]);
                      }}
                    >
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(product.price)}</p>
                          <p className="text-sm text-gray-500">
                            Stock: {product.stockQuantity}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};