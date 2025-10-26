import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './PrintTemplates.css';

const PrintTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [printerDefinitions, setPrinterDefinitions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrinterSalesPoint, setSelectedPrinterSalesPoint] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    template_type: 'fabrication',
    printer_definition_id: '',
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [templatesRes, printersRes, categoriesRes] = await Promise.all([
        supabase
          .from('print_templates')
          .select(`
            *,
            printer_definitions (name, sales_point_id, sales_points(name)),
            print_template_categories (
              category_id,
              product_categories (id, name, icon)
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('printer_definitions')
          .select('id, name, sales_point_id, is_active, sales_points(name)')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('product_categories')
          .select('id, name, icon, description')
          .order('name')
      ]);

      if (templatesRes.data) setTemplates(templatesRes.data);
      if (printersRes.data) setPrinterDefinitions(printersRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.printer_definition_id || !formData.sales_point_id) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.template_type === 'fabrication' && selectedCategories.length === 0) {
      alert('Veuillez sélectionner au moins une catégorie pour un modèle de fabrication');
      return;
    }

    try {
      const dataToSave = {
        name: formData.name,
        template_type: formData.template_type,
        printer_definition_id: formData.printer_definition_id,
        is_active: formData.is_active
      };

      let templateId;

      if (editingTemplate) {
        const { error } = await supabase
          .from('print_templates')
          .update(dataToSave)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        templateId = editingTemplate.id;

        await supabase
          .from('print_template_categories')
          .delete()
          .eq('print_template_id', templateId);
      } else {
        const { data, error } = await supabase
          .from('print_templates')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        templateId = data.id;
      }

      if (selectedCategories.length > 0) {
        const categoryLinks = selectedCategories.map(catId => ({
          print_template_id: templateId,
          category_id: catId
        }));

        const { error: catError } = await supabase
          .from('print_template_categories')
          .insert(categoryLinks);

        if (catError) throw catError;
      }

      alert(editingTemplate ? 'Modèle modifié avec succès' : 'Modèle créé avec succès');
      setShowModal(false);
      setEditingTemplate(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      template_type: template.template_type,
      printer_definition_id: template.printer_definition_id,
      is_active: template.is_active
    });

    const categoryIds = template.print_template_categories
      .map(ptc => ptc.category_id)
      .filter(id => id);
    setSelectedCategories(categoryIds);

    if (template.printer_definitions) {
      const salesPointName = template.printer_definitions.sales_points?.name;
      setSelectedPrinterSalesPoint(salesPointName);
    }

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce modèle d\'impression ?')) return;

    try {
      const { error } = await supabase
        .from('print_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Modèle supprimé');
      loadData();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression: ' + error.message);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      template_type: 'fabrication',
      printer_definition_id: '',
      is_active: true
    });
    setSelectedCategories([]);
    setSelectedPrinterSalesPoint(null);
  };

  const getTypeLabel = (type) => {
    return type === 'caisse' ? 'Ticket de Caisse' : 'Fabrication';
  };

  const getTypeIcon = (type) => {
    return type === 'caisse' ? '🧾' : '📋';
  };

  const handlePrinterChange = (printerId) => {
    setFormData({...formData, printer_definition_id: printerId});
    const selectedPrinter = printerDefinitions.find(p => p.id === printerId);
    if (selectedPrinter) {
      setSelectedPrinterSalesPoint(selectedPrinter.sales_points?.name || null);
    } else {
      setSelectedPrinterSalesPoint(null);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="print-templates-container">
      <div className="page-header">
        <div className="header-content">
          <h2>Gestion des Fonctions d'Impressions</h2>
          <p className="header-subtitle">
            Créez des modèles d'impression et associez-les à des catégories de produits.
            Les tickets de caisse impriment tous les produits, les tickets de fabrication
            impriment uniquement les produits des catégories sélectionnées.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingTemplate(null);
            resetForm();
            setShowModal(true);
          }}
        >
          + Nouveau modèle
        </button>
      </div>

      <div className="templates-grid">
        {templates.length === 0 ? (
          <div className="no-data">
            <p>Aucun modèle d'impression défini</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Créer le premier modèle
            </button>
          </div>
        ) : (
          templates.map(template => (
            <div key={template.id} className={`template-card ${!template.is_active ? 'inactive' : ''}`}>
              <div className="template-header">
                <div className="template-icon">
                  {getTypeIcon(template.template_type)}
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <span className="template-type">{getTypeLabel(template.template_type)}</span>
                </div>
              </div>

              <div className="template-details">
                <div className="detail-item">
                  <strong>Imprimante:</strong>
                  <span>{template.printer_definitions?.name || '-'}</span>
                </div>
                <div className="detail-item">
                  <strong>Point de vente:</strong>
                  <span>{template.printer_definitions?.sales_points?.name || '-'}</span>
                </div>
                <div className="detail-item">
                  <strong>Statut:</strong>
                  <span className={`status-badge ${template.is_active ? 'active' : 'inactive'}`}>
                    {template.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {template.template_type === 'fabrication' && (
                <div className="template-categories">
                  <strong>Catégories associées:</strong>
                  <div className="categories-list">
                    {template.print_template_categories?.length > 0 ? (
                      template.print_template_categories.map(ptc => (
                        ptc.product_categories && (
                          <span key={ptc.category_id} className="category-badge">
                            {ptc.product_categories.icon} {ptc.product_categories.name}
                          </span>
                        )
                      ))
                    ) : (
                      <span className="no-categories">Aucune catégorie</span>
                    )}
                  </div>
                </div>
              )}

              <div className="template-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(template)}
                >
                  ✏️ Modifier
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(template.id)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTemplate ? 'Modifier le modèle' : 'Nouveau modèle d\'impression'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du modèle *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Ex: Fabrication Bar Seven Seven"
                  />
                </div>

                <div className="form-group">
                  <label>Type de modèle *</label>
                  <select
                    value={formData.template_type}
                    onChange={e => setFormData({...formData, template_type: e.target.value})}
                    required
                  >
                    <option value="fabrication">Fabrication</option>
                    <option value="caisse">Ticket de Caisse</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Imprimante logique *</label>
                <select
                  value={formData.printer_definition_id}
                  onChange={e => handlePrinterChange(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une imprimante</option>
                  {printerDefinitions.map(printer => (
                    <option key={printer.id} value={printer.id}>
                      {printer.name} ({printer.sales_points?.name || 'Aucun POS'})
                    </option>
                  ))}
                </select>
                {selectedPrinterSalesPoint && (
                  <small className="info-text">
                    ✅ Point de vente: <strong>{selectedPrinterSalesPoint}</strong>
                  </small>
                )}
              </div>

              {formData.template_type === 'fabrication' && (
                <div className="form-group">
                  <label>Catégories de produits *</label>
                  <div className="categories-selector">
                    {categories.map(category => (
                      <label key={category.id} className="category-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        <span className="category-label">
                          {category.icon} {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  <small>Sélectionnez les catégories qui doivent imprimer sur cette imprimante</small>
                </div>
              )}

              {formData.template_type === 'caisse' && (
                <div className="info-box">
                  ℹ️ Les tickets de caisse impriment automatiquement TOUS les produits de la commande
                </div>
              )}

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  />
                  Modèle actif
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingTemplate ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintTemplates;
