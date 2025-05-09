// File: src/pages/UsuariosPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Plus, Edit, Trash2, Lock, KeyRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useUsuarioStore } from '../store/usuarioStore';
import { Usuario } from '../types';

export const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    isLoading,
    error,
    fetchUsuarios,
    updateUsuario,
    deleteUsuario,
    cambiarPasswordAdmin,
    asignarRol,
  } = useUsuarioStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [form, setForm] = useState<Partial<Usuario>>({});

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<Usuario | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<Usuario | null>(null);
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Filtrado de la tabla
  useEffect(() => {
    let list = usuarios;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(q) ||
        (u.apellido ?? '').toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.idRol.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
    setCurrentPage(1);
  }, [searchQuery, usuarios]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Abrir modal de edición o creación
  const openNewModal = () => {
    setEditing(null);
    setForm({});
    setModalOpen(true);
  };
  const openEditModal = (u: Usuario) => {
    setEditing(u);
    setForm(u);
    setModalOpen(true);
  };

  // Abrir modal de cambiar contraseña
  const openPasswordModal = (u: Usuario) => {
    setSelectedUserForPassword(u);
    setNewPassword('');
    setPasswordModalOpen(true);
  };

  // Abrir modal de asignar rol
  const openRoleModal = (u: Usuario) => {
    setSelectedUserForRole(u);
    setRoleInput(u.idRol);
    setRoleModalOpen(true);
  };

  // Acciones
  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await deleteUsuario(id);
      toast.success('Usuario eliminado');
      await fetchUsuarios();
    } catch {
      toast.error('Error al eliminar usuario');
    }
  };

  const handleUpdate = async () => {
    if (!form.nombre || !form.email || !form.idRol) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    try {
      await updateUsuario(editing!.idUsuario, {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        idRol: form.idRol
      });
      toast.success('Usuario actualizado');
      setModalOpen(false);
      await fetchUsuarios();
    } catch {
      toast.error('Error al actualizar usuario');
    }
  };

  const handleConfirmChangePassword = async () => {
    if (!newPassword || !selectedUserForPassword) return;
    try {
      await cambiarPasswordAdmin(selectedUserForPassword.idUsuario, newPassword);
      toast.success('Contraseña actualizada');
      setPasswordModalOpen(false);
    } catch {
      toast.error('Error al cambiar contraseña');
    }
  };

  const handleConfirmAssignRole = async () => {
    if (!roleInput || !selectedUserForRole) return;
    try {
      await asignarRol(selectedUserForRole.idUsuario, roleInput);
      toast.success('Rol asignado');
      setRoleModalOpen(false);
      await fetchUsuarios();
    } catch {
      toast.error('Error al asignar rol');
    }
  };

  const onRegisterSuccess = async () => {
    setModalOpen(false);
    toast.success('Usuario creado');
    await fetchUsuarios();
  };

  // Render
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  if (isLoading) return <div className="p-4">Cargando usuarios…</div>;

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="text-lg font-medium">Gestión de Usuarios</h3>
        <Button leftIcon={<Plus />} onClick={openNewModal}>Nuevo Usuario</Button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <Input
          placeholder="Buscar por nombre, apellido, email o rol"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : paginated.map(u => (
              <TableRow key={u.idUsuario}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.apellido || '-'}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.idRol}</TableCell>
                <TableCell>{new Date(u.fechaCreacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    {/* Edit */}
                    <div className="flex flex-col items-center">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(u)}>
                        <Edit size={16}/>
                      </Button>
                      <span className="text-xs text-gray-500">Editar</span>
                    </div>
                    {/* Delete */}
                    <div className="flex flex-col items-center">
                      <Button size="sm" variant="outline" className="text-error-600" onClick={() => handleDelete(u.idUsuario)}>
                        <Trash2 size={16}/>
                      </Button>
                      <span className="text-xs text-gray-500">Eliminar</span>
                    </div>
                    {/* Change Password */}
                    <div className="flex flex-col items-center">
                      <Button size="sm" variant="outline" onClick={() => openPasswordModal(u)}>
                        <KeyRound size={16}/>
                      </Button>
                      <span className="text-xs text-gray-500">Contraseña</span>
                    </div>
                    {/* Assign Role */}
                    <div className="flex flex-col items-center">
                      <Button size="sm" variant="outline" onClick={() => openRoleModal(u)}>
                        <Lock size={16}/>
                      </Button>
                      <span className="text-xs text-gray-500">Asignar rol</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1}>Anterior</Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages}>Siguiente</Button>
        </div>
      )}

      {/* Modal Edición/Registro */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Usuario' : 'Registrar Usuario'} maxWidth="md">
        <ModalBody>
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" value={form.nombre||''} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/>
              <Input label="Apellido" value={form.apellido||''} onChange={e=>setForm(f=>({...f,apellido:e.target.value}))}/>
              <Input label="Email" type="email" value={form.email||''} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
              <Input label="Rol" value={form.idRol||''} onChange={e=>setForm(f=>({...f,idRol:e.target.value}))}/>
            </div>
          ) : (
            <RegisterForm onSuccess={onRegisterSuccess} onCancel={()=>setModalOpen(false)}/>
          )}
        </ModalBody>
        {editing && (
          <ModalFooter>
            <Button variant="outline" onClick={()=>setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate}>Actualizar Usuario</Button>
          </ModalFooter>
        )}
      </Modal>

      {/* Modal Cambiar Contraseña */}
      <Modal isOpen={passwordModalOpen} onClose={()=>setPasswordModalOpen(false)} title="Cambiar contraseña" maxWidth="sm">
        <ModalBody>
          <Input
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={e=>setNewPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={()=>setPasswordModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmChangePassword}>Cambiar</Button>
        </ModalFooter>
      </Modal>

      {/* Modal Asignar Rol */}
      <Modal isOpen={roleModalOpen} onClose={()=>setRoleModalOpen(false)} title="Asignar nuevo rol" maxWidth="sm">
        <ModalBody>
          <Select
            label="Rol"
            value={roleInput}
            onChange={e=>setRoleInput(e.target.value)}
            options={[
              { value: 'Administrador', label: 'Administrador' },
              { value: 'Farmacéutico', label: 'Farmacéutico' },
              { value: 'Proveedor',      label: 'Proveedor' },
              { value: 'Cajero',         label: 'Cajero' },
            ]}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={()=>setRoleModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmAssignRole}>Asignar rol</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};