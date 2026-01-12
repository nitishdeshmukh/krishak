import PaddySales from "../../models/sales/PaddySales.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  getPagination,
  buildPaginationResponse,
  getSorting,
  getFilters,
} from "../../utils/pagination.js";

// Get all paddy sales (only sale numbers for dropdowns)
export const getAllPaddySales = asyncHandler(async (req, res) => {
  const paddySales = await PaddySales.find({ isActive: { $ne: false } }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, data: paddySales });
});

// Get paddy sale by sale number (for auto-fill)
export const getPaddySaleBySaleNumber = asyncHandler(async (req, res) => {
  const { saleNumber } = req.params;
  const record = await PaddySales.findOne({
    dealNumber: saleNumber,
    isActive: { $ne: false },
  }).select("partyName brokerName paddyType");
  if (!record)
    return res
      .status(404)
      .json({ success: false, message: "Paddy sale not found" });
  res.status(200).json({ success: true, data: record });
});

export const getPaddySales = asyncHandler(async (req, res) => {
  const { page, pageSize } = getPagination(req.query);
  const sort = getSorting(req.query);
  const filters = getFilters(req.query, ["partyName", "brokerName"]);
  filters.isActive = { $ne: false };
  const aggregate = PaddySales.aggregate([
    { $match: filters },
    { $sort: sort },
  ]);
  const result = await PaddySales.aggregatePaginate(aggregate, {
    page,
    limit: pageSize,
  });
  res.status(200).json({
    success: true,
    data: {
      paddySales: result.docs,
      totalPaddySales: result.totalDocs,
      ...buildPaginationResponse(result.totalDocs, page, pageSize),
    },
  });
});

export const getPaddySaleById = asyncHandler(async (req, res) => {
  const record = await PaddySales.findById(req.params.id);
  if (!record)
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  res.status(200).json({ success: true, data: record });
});

export const createPaddySale = asyncHandler(async (req, res) => {
  const record = await PaddySales.create(req.body);
  res
    .status(201)
    .json({ success: true, message: "Created successfully", data: record });
});

export const updatePaddySale = asyncHandler(async (req, res) => {
  const record = await PaddySales.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!record)
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  res
    .status(200)
    .json({ success: true, message: "Updated successfully", data: record });
});

export const deletePaddySale = asyncHandler(async (req, res) => {
  const record = await PaddySales.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!record)
    return res
      .status(404)
      .json({ success: false, message: "Record not found" });
  res.status(200).json({ success: true, message: "Deleted successfully" });
});
