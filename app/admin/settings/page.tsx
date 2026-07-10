'use client';

import { useState, useEffect } from 'react';
import { Building2, Phone, Mail, LogOut, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [clinicName, setClinicName] = useState('Clínica de Autocuidado Proactivo');
  const [phone, setPhone] = useState('+56 9 7553 9913');
  const [email, setEmail] = useState('eu.leon.educa@gmail.com');
  
  const [logoUrl, setLogoUrl] = useState('');
  const [heroBgUrl, setHeroBgUrl] = useState('');
  const [aboutImageUrl, setAboutImageUrl] = useState('');

  const [heroTitle, setHeroTitle] = useState('Hacia el Bienestar y al Rendimiento.');
  const [heroSubtitle, setHeroSubtitle] = useState('Gestión de Autocuidado Proactiva. Servicios profesionales de enfermería clínica a domicilio y entrenamiento de calistenia personalizado en Puerto Varas y alrededores.');
  const [aboutName, setAboutName] = useState('Benjamín León');
  const [aboutTags, setAboutTags] = useState('Magíster Gestión Sanitaria, UTI & Urgencias, Medicina Deportiva');
  const [aboutDesc, setAboutDesc] = useState('Mi trabajo se fundamenta en un profundo sentido de responsabilidad clínica y deportiva. Cada atención de enfermería a domicilio y cada entrenamiento de calistenia se afronta con el mismo rigor y entusiasmo. Mi objetivo es brindarte herramientas reales, motivación constante y una atención impecable.');


  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<'logo' | 'hero' | 'about' | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'hero' | 'about') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(type);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'branding');
      formData.append('filePath', filePath);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      if (type === 'logo') setLogoUrl(result.publicUrl);
      if (type === 'hero') setHeroBgUrl(result.publicUrl);
      if (type === 'about') setAboutImageUrl(result.publicUrl);
      
      // Auto-guardar el perfil después de subir la imagen (pasando la nueva URL para evitar problemas de asincronía)
      await handleSaveProfile({
        overrideLogoUrl: type === 'logo' ? result.publicUrl : undefined,
        overrideHeroUrl: type === 'hero' ? result.publicUrl : undefined,
        overrideAboutUrl: type === 'about' ? result.publicUrl : undefined,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Hubo un error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setUploadingImage(null);
    }
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;
        if (data) {
          data.forEach((item: { key: string; value: string }) => {
            if (item.key === 'clinic_name') setClinicName(item.value);
            else if (item.key === 'phone') setPhone(item.value);
            else if (item.key === 'email') setEmail(item.value);
            else if (item.key === 'logo_url') setLogoUrl(item.value);
            else if (item.key === 'hero_bg_url') setHeroBgUrl(item.value);
            else if (item.key === 'about_image_url') setAboutImageUrl(item.value);
            else if (item.key === 'hero_title') setHeroTitle(item.value);
            else if (item.key === 'hero_subtitle') setHeroSubtitle(item.value);
            else if (item.key === 'about_name') setAboutName(item.value);
            else if (item.key === 'about_tags') setAboutTags(item.value);
            else if (item.key === 'about_desc') setAboutDesc(item.value);
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    fetchSettings();
  }, []);



  const handleSaveProfile = async (overrides?: { overrideLogoUrl?: string, overrideHeroUrl?: string, overrideAboutUrl?: string }) => {
    setSavingProfile(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'clinic_name', value: clinicName },
            { key: 'phone', value: phone },
            { key: 'email', value: email },
            { key: 'logo_url', value: overrides?.overrideLogoUrl ?? logoUrl },
            { key: 'hero_bg_url', value: overrides?.overrideHeroUrl ?? heroBgUrl },
            { key: 'about_image_url', value: overrides?.overrideAboutUrl ?? aboutImageUrl },
            { key: 'hero_title', value: heroTitle },
            { key: 'hero_subtitle', value: heroSubtitle },
            { key: 'about_name', value: aboutName },
            { key: 'about_tags', value: aboutTags },
            { key: 'about_desc', value: aboutDesc },
          ]
        })
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      
      alert('¡Ajustes guardados con éxito!');
    } catch (err) {
      console.error('Error saving profile settings:', err);
      alert('Error al guardar los ajustes.');
    } finally {
      setSavingProfile(false);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* Header */}
      <header className="mb-10 border-b border-hairline pb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Ajustes
        </h1>
        <p className="text-gray-400 mt-2">Configura tu clínica, integraciones y credenciales de API.</p>
      </header>

      <div className="max-w-3xl space-y-10">
        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 1: Perfil de la Clínica
        ════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Perfil de la Clínica</h2>
              <p className="text-xs text-gray-500">Información visible para los pacientes.</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-hairline-soft p-6 space-y-6">
            {/* Nombre de la Clínica */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Nombre de la Clínica
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Teléfono WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Teléfono WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-mint-500 focus:border-transparent outline-none transition-all text-white"
                />
              </div>
            </div>

            {/* Email de Contacto */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Email de Contacto
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-hairline rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => handleSaveProfile()}
              disabled={savingProfile}
              className="w-full bg-cyan-500 text-black font-bold py-3.5 rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savingProfile ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar Perfil
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 2: Branding Visual (Imágenes)
        ════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Branding Visual</h2>
              <p className="text-xs text-gray-500">Configura el logo y las imágenes principales de la web (urls).</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-hairline-soft p-6 space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Logo (Navbar)
              </label>
              <div className="flex gap-4 items-center">
                {logoUrl && (
                  <div className="relative w-16 h-16 rounded-lg bg-background/50 border border-hairline flex items-center justify-center overflow-hidden flex-shrink-0 group/img">
                    <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button
                      onClick={() => {
                        setLogoUrl('');
                        handleSaveProfile({ overrideLogoUrl: '' });
                      }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                )}
                <div className="flex-1 relative group cursor-pointer border-2 border-dashed border-hairline hover:border-purple-500/50 rounded-xl bg-background p-4 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    disabled={uploadingImage === 'logo'}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      {uploadingImage === 'logo' ? (
                        <span className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Subir nuevo logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG, SVG o WEBP (máx. 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Background */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Fondo Pantalla Principal (Hero)
              </label>
              <div className="flex gap-4 items-center">
                {heroBgUrl && (
                  <div className="relative w-16 h-16 rounded-lg bg-background/50 border border-hairline overflow-hidden flex-shrink-0 group/img">
                    <img src={heroBgUrl} alt="Hero" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setHeroBgUrl('');
                        handleSaveProfile({ overrideHeroUrl: '' });
                      }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                )}
                <div className="flex-1 relative group cursor-pointer border-2 border-dashed border-hairline hover:border-purple-500/50 rounded-xl bg-background p-4 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero')}
                    disabled={uploadingImage === 'hero'}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      {uploadingImage === 'hero' ? (
                        <span className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Subir imagen de fondo</p>
                      <p className="text-xs text-gray-500">Imágenes panorámicas recomendadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Image */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Foto "Sobre Mí" (Educación)
              </label>
              <div className="flex gap-4 items-center">
                {aboutImageUrl && (
                  <div className="relative w-16 h-16 rounded-lg bg-background/50 border border-hairline overflow-hidden flex-shrink-0 group/img">
                    <img src={aboutImageUrl} alt="Sobre mi" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setAboutImageUrl('');
                        handleSaveProfile({ overrideAboutUrl: '' });
                      }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                )}
                <div className="flex-1 relative group cursor-pointer border-2 border-dashed border-hairline hover:border-purple-500/50 rounded-xl bg-background p-4 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'about')}
                    disabled={uploadingImage === 'about'}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      {uploadingImage === 'about' ? (
                        <span className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Subir foto de perfil</p>
                      <p className="text-xs text-gray-500">Fotografía profesional (vertical o cuadrada)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 3: Textos Principales
        ════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Textos Principales</h2>
              <p className="text-xs text-gray-500">Configura los mensajes de bienvenida y biografía.</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-hairline-soft p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Título del Inicio
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-background border border-hairline rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Subtítulo del Inicio
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-background border border-hairline rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Nombre (Sección Sobre Mí)
              </label>
              <input
                type="text"
                value={aboutName}
                onChange={(e) => setAboutName(e.target.value)}
                className="w-full bg-background border border-hairline rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Especialidades (separadas por comas)
              </label>
              <input
                type="text"
                value={aboutTags}
                onChange={(e) => setAboutTags(e.target.value)}
                className="w-full bg-background border border-hairline rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Descripción (Sobre Mí)
              </label>
              <textarea
                rows={4}
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                className="w-full bg-background border border-hairline rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all resize-none"
              />
            </div>
            
            <button
              onClick={() => handleSaveProfile()}
              disabled={savingProfile}
              className="w-full bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {savingProfile ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar Textos
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECCIÓN 4: Sesión
        ════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sesión</h2>
              <p className="text-xs text-gray-500">Opciones de tu cuenta.</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-hairline-soft p-6">
            {!showLogoutConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">Cerrar Sesión</h3>
                  <p className="text-xs text-gray-500 mt-1">Serás desconectado del panel de administración.</p>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-foreground/5 text-gray-300 border border-hairline font-bold px-6 py-3 rounded-xl hover:bg-foreground/10 hover:text-white transition-all text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white font-bold mb-1">¿Cerrar tu sesión?</p>
                <div className="flex gap-3 justify-center mt-6">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="bg-foreground/5 text-white font-bold px-8 py-3 rounded-xl hover:bg-foreground/10 transition-all text-sm border border-hairline"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implementar logout real
                      // await supabase.auth.signOut();
                      // router.push('/');
                      console.log('Logout');
                    }}
                    className="bg-cyan-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-cyan-400 transition-all text-sm shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  >
                    Sí, Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
