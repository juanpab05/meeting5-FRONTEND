// Robust UserProfile con WCAG 4.x (Robustez) aplicado
"use client"

import { User, Edit, Trash2, Heart, Users, Loader2, Lock, AlertCircle, Camera } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { fetchUserProfile, fetchUpdateUserProfile, fetchDeleteUser } from "../api/user"
import { useNavigate } from "react-router"
import { UserData } from "../schemas/user"
import { useUser } from "../context/UserContext"
import Loading from "../components/Loading"
import { fetchChangePassword, fetchUploadAvatar, fetchVerifyPassword } from "../api/user-utils"

export function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', surname: '', age: '' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [autoHideMessages, setAutoHideMessages] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [deleteConfirmForm, setDeleteConfirmForm] = useState({
    currentPassword: '',
    confirmationText: ''
  })
  const [newPhoto, setNewPhoto] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const navigate = useNavigate()
  const { loadingUser, refreshUser } = useUser()

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        const profile = await fetchUserProfile()
        setUserData(profile.data)
        setEditForm({
          name: profile.data.name || '',
          surname: profile.data.surname || '',
          age: profile.data.age?.toString() || ''
        })
        setError(null)
      } catch (error) {
        console.error('Error loading profile:', error)
        setError(error instanceof Error ? error.message : 'Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    };

    loadUserProfile();
  }, []);

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (autoHideMessages && successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, autoHideMessages]);
  
  useEffect(() => {
    if (autoHideMessages && error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error, autoHideMessages]);

  const validateProfileForm = () => {
    if (!editForm.name.trim()) { setError('El nombre es requerido'); return false }
    if (editForm.name.trim().length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return false }
    if (editForm.surname && editForm.surname.trim().length < 2) { setError('El apellido debe tener al menos 2 caracteres'); return false }
    if (editForm.age && (parseInt(editForm.age) < 1 || parseInt(editForm.age) > 120)) { setError('La edad debe estar entre 1 y 120 años'); return false }
    return true
  }

  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Todos los campos de contraseña son requeridos')
      return false
    }
    if (passwordForm.newPassword.length < 8) { setError('La nueva contraseña debe tener al menos 8 caracteres'); return false }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError('Las contraseñas no coinciden'); return false }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(passwordForm.newPassword)) { setError('La contraseña debe tener al menos una mayúscula, una minúscula y un número'); return false }
    return true
  }

  const handleSave = async () => { await handleUpdateProfile(); await refreshUser() }

  const handleUpdateProfile = async () => {
    if (!userData || !validateProfileForm()) return
    try {
      setUpdatingProfile(true)
      setError(null)

      const updateData: Partial<UserData> = { name: editForm.name.trim() }
      if (editForm.surname.trim()) updateData.surname = editForm.surname.trim()
      if (editForm.age) updateData.age = parseInt(editForm.age)

      const updatedUser = await fetchUpdateUserProfile(updateData)
      setUserData(updatedUser.data)

      const storedUser = localStorage.getItem("user")
      let userObj = storedUser ? JSON.parse(storedUser) : {}
      userObj.name = updateData.name
      localStorage.setItem("user", JSON.stringify(userObj))

      setIsEditing(false)
      setSuccessMessage('✅ Tu perfil ha sido actualizado correctamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error instanceof Error ? error.message : 'Error al actualizar el perfil')
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return
    try {
      setChangingPassword(true)
      setError(null)

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      await fetchChangePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })

      setShowPasswordChange(false)
      setSuccessMessage('🔒 Tu contraseña ha sido actualizada correctamente')
    } catch (error) {
      console.error('Error changing password:', error)
      setError(error instanceof Error ? error.message : 'Error al cambiar la contraseña')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userData) return
    try {
      setDeletingAccount(true)
      setError(null)
      if (!deleteConfirmForm.currentPassword.trim()) throw new Error('Debes ingresar tu contraseña actual')
      if (deleteConfirmForm.confirmationText !== 'ELIMINAR CUENTA') throw new Error('Debes escribir exactamente "ELIMINAR CUENTA" para confirmar')

      await fetchVerifyPassword(deleteConfirmForm.currentPassword)
      await fetchDeleteUser()

      setSuccessMessage('Tu cuenta ha sido eliminada correctamente. Redirigiendo...')
      setShowDeleteConfirm(false)

      setTimeout(() => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Error deleting account:', error)
      setError(error instanceof Error ? error.message : 'Error al eliminar la cuenta')
    } finally {
      setDeletingAccount(false)
    }
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false)
    setDeleteConfirmForm({ currentPassword: '', confirmationText: '' })
    setError(null)
  }

  const formatMemberSince = (dateString: any) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setNewPhoto(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return alert("Por favor selecciona una imagen antes de actualizar.")
    try { await fetchUploadAvatar(selectedFile); alert("Imagen actualizada exitosamente!") }
    catch (error) { console.error("Error al subir la imagen:", error) }
  }

  if (loading) return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" aria-label="Cargando perfil" />
      </div>
    </div>
  )

  if (!userData) return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400" role="alert">No se pudo cargar la información del usuario</p>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 pb-8 max-w-7xl md:pt-8 self-start">

      {/* Mensajes accesibles con aria-live */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" role="alert" aria-live="assertive">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="mb-6 bg-[#375566]/10 border border-[#375566]/30 rounded-lg p-4" role="status" aria-live="polite">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#375566] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[#375566] font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 mt-20 md:mt-5" role="banner">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            {userData.profilePicture?.profilePictureURL ? (
              <img
                src={userData.profilePicture.profilePictureURL}
                alt={"Foto de perfil"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center"
                aria-label="Usuario sin foto de perfil"
              >
                <User className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi perfil</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </header>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information - Mantener el fondo oscuro */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-4 gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Información personal</h3>
              </div>
              <button
                onClick={() => setAutoHideMessages(prev => !prev)}
                className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md text-sm"
                aria-pressed={autoHideMessages}
              >
                {autoHideMessages ? "Mensajes: Auto Ocultar" : "Mensajes: Manual"}
              </button>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-md font-semibold shadow hover:brightness-95 dark:hover:brightness-110 transition-all"
                  disabled={updatingProfile}
                  aria-disabled={updatingProfile}
                >
                  <Edit className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Editar perfil</span>
                  <span className="sm:hidden">Editar</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#375566] text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-[#2d4452] transition-colors"
                    disabled={updatingProfile}
                    aria-disabled={updatingProfile}
                  >
                    {updatingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span className="hidden sm:inline">Guardando...</span>
                        <span className="sm:hidden">Guardando...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Guardar cambios</span>
                        <span className="sm:hidden">Guardar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        name: userData.name || '',
                        surname: userData.surname || '',
                        age: userData.age?.toString() || ''
                      });
                      setError(null);
                    }}
                    className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors font-medium"
                    disabled={updatingProfile}
                    aria-disabled={updatingProfile}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 space-y-4">
              {/* Campos de nombre y apellido en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                    Nombre
                  </label>
                  {isEditing ? (
                    <input
                      id="name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ingresa tu nombre"
                      disabled={updatingProfile}
                      aria-disabled={updatingProfile}
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white" id="name-display">{userData.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="surname" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                    Apellido
                  </label>
                  {isEditing ? (
                    <input
                      id="surname"
                      type="text"
                      value={editForm.surname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, surname: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Ingresa tu apellido (opcional)"
                      disabled={updatingProfile}
                      aria-disabled={updatingProfile}
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white" id="surname-display">
                      {userData.surname || 'No especificado'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block" htmlFor="email">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white" id="email">{userData.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  El email no se puede cambiar
                </p>
              </div>

              <div>
                <label htmlFor="age" className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Edad
                </label>
                {isEditing ? (
                  <input
                    id="age"
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Edad (opcional)"
                    min="1"
                    max="120"
                    disabled={updatingProfile}
                    aria-disabled={updatingProfile}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white" id="age-display">
                    {userData.age ? `${userData.age} años` : 'No especificada'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                  Miembro desde
                </label>
                <p className="text-gray-900 dark:text-white" id="member-since">
                  {formatMemberSince(userData.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Password Change - Fondo blanco */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-4 gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contraseña</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Mantén tu cuenta segura actualizando tu contraseña regularmente
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordChange(!showPasswordChange);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setError(null);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-700 bg-opacity-60 dark:bg-gray-600 dark:bg-opacity-60 text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-80 dark:hover:bg-opacity-80 transition-all"
                aria-expanded={showPasswordChange}
              >
                <Lock className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {showPasswordChange ? 'Cancelar cambio' : 'Cambiar contraseña'}
                </span>
                <span className="sm:hidden">
                  {showPasswordChange ? 'Cancelar' : 'Cambiar'}
                </span>
              </button>
            </div>

            {showPasswordChange && (
              <div className="px-6 pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="currentPassword" className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Contraseña actual
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={changingPassword}
                      placeholder="Ingresa tu contraseña actual"
                      aria-disabled={changingPassword}
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={changingPassword}
                      placeholder="Nueva contraseña"
                      aria-disabled={changingPassword}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={changingPassword}
                      placeholder="Confirma la contraseña"
                      aria-disabled={changingPassword}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md" role="region" aria-label="Requisitos de contraseña">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Requisitos de contraseña:</strong>
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-500 mt-1 space-y-1">
                    <li>• Mínimo 8 caracteres</li>
                    <li>• Al menos una letra mayúscula</li>
                    <li>• Al menos una letra minúscula</li>
                    <li>• Al menos un número</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#375566] text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-[#2d4452] transition-colors"
                    disabled={changingPassword}
                    aria-disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span className="hidden sm:inline">Cambiando...</span>
                        <span className="sm:hidden">Cambiando...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Cambiar contraseña</span>
                        <span className="sm:hidden">Cambiar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setError(null);
                    }}
                    className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors font-medium"
                    disabled={changingPassword}
                    aria-disabled={changingPassword}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Account Management - Botón rojo solo para eliminar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 pb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de cuenta</h3>
            </div>
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E60914] text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-[#c00812] transition-colors"
                disabled={deletingAccount}
                aria-disabled={deletingAccount}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Eliminar cuenta
              </button>
            </div>
          </div>


          {/* Modal de confirmación para eliminar cuenta */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 id="delete-account-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                      Eliminar cuenta
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    ¿Estás seguro de que quieres eliminar tu cuenta permanentemente?
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                    <li>• Se eliminarán todos tus datos personales</li>
                    <li>• Perderás acceso a tu historial</li>
                    <li>• Esta acción es irreversible</li>
                  </ul>

                  {/* Campo de contraseña actual */}
                  <div className="mb-4">
                    <label htmlFor="delete-current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contraseña actual *
                    </label>
                    <input
                      id="delete-current-password"
                      type="password"
                      value={deleteConfirmForm.currentPassword}
                      onChange={(e) => setDeleteConfirmForm(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ingresa tu contraseña actual"
                      disabled={deletingAccount}
                      aria-disabled={deletingAccount}
                    />
                  </div>

                  {/* Campo de confirmación de texto */}
                  <div className="mb-4">
                    <label htmlFor="delete-confirm-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Escribe "ELIMINAR CUENTA" para confirmar *
                    </label>
                    <input
                      id="delete-confirm-text"
                      type="text"
                      value={deleteConfirmForm.confirmationText}
                      onChange={(e) => setDeleteConfirmForm(prev => ({
                        ...prev,
                        confirmationText: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="ELIMINAR CUENTA"
                      disabled={deletingAccount}
                      aria-disabled={deletingAccount}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Debes escribir exactamente "ELIMINAR CUENTA" (en mayúsculas)
                    </p>
                  </div>

                  {/* Mostrar error si existe */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md" role="alert">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#E60914] hover:bg-[#c20812] text-white rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletingAccount || !deleteConfirmForm.currentPassword.trim() || deleteConfirmForm.confirmationText !== 'ELIMINAR CUENTA'}
                    aria-disabled={deletingAccount || !deleteConfirmForm.currentPassword.trim() || deleteConfirmForm.confirmationText !== 'ELIMINAR CUENTA'}
                  >
                    {deletingAccount ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                        Eliminar cuenta
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCloseDeleteModal}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    disabled={deletingAccount}
                    aria-disabled={deletingAccount}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">

          {/** Photo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col items-center space-y-6 justify-center p-6 pb-4">
              {(newPhoto != null) ? (
                <img
                  src={newPhoto}
                  alt="Preview de la foto de perfil"
                  className="flex flex-row rounded-4xl h-30 w-30 object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-[#375566] to-[#2d4452] p-4 rounded-4xl h-30 w-30 flex items-center justify-center">
                  <Camera className="h-15 w-15 text-white" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-[10%] mb-4">
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-label="Selecciona una imagen para subir como foto de perfil"
              />

              <label
                htmlFor="fileUpload"
                className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-md font-semibold shadow hover:brightness-95 dark:hover:brightness-110 transition-all"
              >
                Subir foto
              </label>

              <button
                onClick={handleUpload}
                className="inline-flex items-center justify-center gap-2 bg-[#375566] text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-[#2d4452] transition-colors"
                aria-label="Actualizar foto de perfil"
              >
                Actualizar
              </button>
            </div>
          </div>

          {/* Favorites - Fondo blanco */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E60914] fill-[#E60914]" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mis favoritos</h3>
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Próximamente disponible</p>
              <button
                onClick={() => navigate('/favorites')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-white bg-red-600 rounded-md"
                aria-label="Ver mis favoritos"
              >
                Ver mis favoritos
              </button>
            </div>
          </div>

          {/* Quick Actions - Fondo blanco */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Acciones rápidas</h3>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => navigate('/catalog')}
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-80 dark:hover:bg-opacity-80 transition-all"
                aria-label="Ver catálogo de usuarios"
              >
                <Users className="w-4 h-4" aria-hidden="true" />
                Ver catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}