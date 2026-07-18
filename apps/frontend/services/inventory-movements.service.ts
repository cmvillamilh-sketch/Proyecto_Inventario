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

async function getAll(): Promise<InventoryMovement[]> {
  const response = await fetch(`${API_BASE_URL}/inventory-movements`);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

async function getOne(id: string): Promise<InventoryMovement> {
  const response = await fetch(`${API_BASE_URL}/inventory-movements/${id}`);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return response.json();
}

async function create(dto: CreateInventoryMovementDto): Promise<InventoryMovement> {
  const response = await fetch(`${API_BASE_URL}/inventory-movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
