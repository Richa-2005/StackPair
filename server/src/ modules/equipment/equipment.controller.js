import { success } from "../../utils/response.js";
import {
  listEquipment,
  createEquipment,
  getEquipmentById,
  updateEquipment,
  getEquipmentRequests,
} from "./equipment.service.js";

export async function list(req, res, next) {
  try {
    const { search = "", groupBy = "" } = req.query;
    const rows = await listEquipment({ search, groupBy });
    success(res, rows);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const created = await createEquipment(req.body);
    success(res, created, 201);
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const item = await getEquipmentById(req.params.id);
    if (!item) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Equipment not found" },
      });
    }
    success(res, item);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await updateEquipment(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Equipment not found" },
      });
    }
    success(res, updated);
  } catch (e) {
    next(e);
  }
}

export async function requests(req, res, next) {
  try {
    const result = await getEquipmentRequests(req.params.id);
    success(res, result); // { rows, openCount }
  } catch (e) {
    next(e);
  }
}