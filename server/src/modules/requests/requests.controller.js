import {
  createRequest,
  listRequests,
  getRequestById,
  assignRequest,
  updateRequestStatus,
} from "./requests.service.js";
import { getKanban } from "./requests.service.js";
import { getMyRequests } from "./requests.service.js";

import { getRequestsByTechnician } from "./requests.service.js";

import { updateRequest } from "./requests.service.js";
import { success } from "../../utils/response.js";
import { getCalendarRequests } from "./requests.service.js";

export async function calendarController(req, res, next) {
  try {
    const { from = null, to = null } = req.query;
    const rows = await getCalendarRequests({ user: req.user, from, to });
    success(res, rows);
  } catch (e) {
    next(e);
  }
}
export async function updateRequestController(req, res, next) {
  try {
    const requestId = Number(req.params.id);
    const data = await updateRequest({ requestId, payload: req.body });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}
export async function assignedByTechController(req, res, next) {
  try {
    const techId = Number(req.params.techId);
    const data = await getRequestsByTechnician({ techId });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}
export async function kanbanController(req, res, next) {
  try {
    const data = await getKanban({ user: req.user });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}

export async function myRequestsController(req, res, next) {
  try {
    const data = await getMyRequests({ user: req.user });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}
export async function createRequestController(req, res, next) {
  try {
    const data = await createRequest({ userId: req.user.id, payload: req.body });
    res.status(201).json({ data });
  } catch (e) {
    next(e);
  }
}

export async function listRequestsController(req, res, next) {
  try {
    const data = await listRequests({ user: req.user });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}

export async function getRequestController(req, res, next) {
  try {
    const data = await getRequestById({ id: Number(req.params.id), user: req.user });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}

export async function assignRequestController(req, res, next) {
  try {
    const data = await assignRequest({
      requestId: Number(req.params.id),
      assignedToUserId: Number(req.body.assignedToUserId),
    });
    return res.json({ data });
  } catch (e) {
    next(e);
  }
}

export async function updateStatusController(req, res, next) {
  try {
    const { status, durationHours } = req.body;
    const data = await updateRequestStatus({
      requestId: Number(req.params.id),
      status,
      durationHours,
      user: req.user,
    });
    res.json({ data });
  } catch (e) {
    next(e);
  }
}