import { API_BASE_URL } from '../lib/api';
import { Material } from '../types/material';
import { CreateMaterialDto, UpdateMaterialDto } from '../types/material.dto';

export async function getMaterials(): Promise<Material[]> {
  const response = await fetch(`${API_BASE_URL}/materials`);

  if (!response.ok) {
    throw new Error('Failed to fetch materials');
  }

  return response.json();
}

export async function createMaterial(material: CreateMaterialDto): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(material),
  });

  if (!response.ok) {
    throw new Error('Failed to create material');
  }

  return response.json();
}

export async function getMaterialById(id: string): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch material');
  }

  return response.json();
}

export async function updateMaterial(id: string, material: UpdateMaterialDto): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(material),
  });

  if (!response.ok) {
    throw new Error('Failed to update material');
  }

  return response.json();
}

export async function deleteMaterial(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete material');
  }
}
