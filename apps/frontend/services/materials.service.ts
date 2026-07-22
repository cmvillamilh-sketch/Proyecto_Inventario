import { API_BASE_URL } from '../lib/api';
import { Material } from '../types/material';
import { CreateMaterialDto, UpdateMaterialDto } from '../types/material.dto';

async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message || 'Ocurrió un error inesperado.';
}

export async function getMaterials(token: string): Promise<Material[]> {
  const response = await fetch(`${API_BASE_URL}/materials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

export async function createMaterial(material: CreateMaterialDto, token: string): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(material),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

export async function getMaterialById(id: string, token: string): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

export async function updateMaterial(id: string, material: UpdateMaterialDto, token: string): Promise<Material> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(material),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

export async function deleteMaterial(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
}
