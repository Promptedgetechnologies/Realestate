'use client';

import { useState } from 'react';
import { Property } from '@/lib/data-loader';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

interface PropertyManagementProps {
  properties: Property[];
  onUpdate: () => void;
}

export default function PropertyManagement({ properties, onUpdate }: PropertyManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment',
    location: '',
    city: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sqft',
    description: '',
    features: '',
    amenities: '',
    nearbyFacilities: '',
    coordinates: { lat: '', lng: '' },
  });

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: parseInt(formData.area),
          features: formData.features.split(',').map(f => f.trim()),
          amenities: formData.amenities.split(',').map(a => a.trim()),
          nearbyFacilities: formData.nearbyFacilities.split(',').map(n => n.trim()),
          coordinates: {
            lat: parseFloat(formData.coordinates.lat),
            lng: parseFloat(formData.coordinates.lng),
          },
          images: [],
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        resetForm();
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      location: property.location,
      city: property.city,
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      areaUnit: property.areaUnit,
      description: property.description,
      features: property.features.join(', '),
      amenities: property.amenities.join(', '),
      nearbyFacilities: property.nearbyFacilities.join(', '),
      coordinates: {
        lat: property.coordinates.lat.toString(),
        lng: property.coordinates.lng.toString(),
      },
    });
    setShowAddForm(true);
  };

  const handleUpdate = async () => {
    if (!editingProperty) return;

    try {
      const response = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProperty.id,
          ...formData,
          price: parseInt(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: parseInt(formData.area),
          features: formData.features.split(',').map(f => f.trim()),
          amenities: formData.amenities.split(',').map(a => a.trim()),
          nearbyFacilities: formData.nearbyFacilities.split(',').map(n => n.trim()),
          coordinates: {
            lat: parseFloat(formData.coordinates.lat),
            lng: parseFloat(formData.coordinates.lng),
          },
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditingProperty(null);
        resetForm();
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Apartment',
      location: '',
      city: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaUnit: 'sqft',
      description: '',
      features: '',
      amenities: '',
      nearbyFacilities: '',
      coordinates: { lat: '', lng: '' },
    });
    setEditingProperty(null);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    }
    return `₹${(price / 100000).toFixed(2)}L`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Properties</h2>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add New Property</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button onClick={() => {
              setShowAddForm(false);
              resetForm();
            }}>
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Apartment</option>
                <option>Villa</option>
                <option>Penthouse</option>
                <option>Studio</option>
                <option>House</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms *</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms *</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area *</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <select
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                >
                  <option>sqft</option>
                  <option>sqm</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Features (comma-separated)</label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Marble Flooring, Modular Kitchen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amenities (comma-separated)</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Swimming Pool, Gym"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.coordinates.lat}
                onChange={(e) => setFormData({
                  ...formData,
                  coordinates: { ...formData.coordinates, lat: e.target.value }
                })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.coordinates.lng}
                onChange={(e) => setFormData({
                  ...formData,
                  coordinates: { ...formData.coordinates, lng: e.target.value }
                })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={editingProperty ? handleUpdate : handleAdd}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {editingProperty ? 'Update' : 'Add'} Property
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bedrooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.location}, {property.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{formatPrice(property.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.bedrooms} BHK</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.views}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

