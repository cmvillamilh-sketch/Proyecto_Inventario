import { API_BASE_URL } from '../lib/api';
import { InventoryMovement } from '../types/inventory-movement';
import { CreateInventoryMovementDto } from '../types/inventory-movement.dto';

async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message || 'Ocurrió un error inesperado.';
}

async function getAll(token: string): Promise<InventoryMovement[]> {
  const response = await fetch(`${API_BASE_URL}/inventory-movements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

async function getOne(id: string, token: string): Promise<InventoryMovement> {
  const response = await fetch(`${API_BASE_URL}/inventory-movements/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

async function create(dto: CreateInventoryMovementDto, token: string): Promise<InventoryMovement> {
  const response = await fetch(`${API_BASE_URL}/inventory-movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

export const inventoryMovementsService = {
  getAll,
  getOne,
  create,
};
