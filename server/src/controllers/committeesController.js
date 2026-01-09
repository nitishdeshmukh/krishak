/**
 * Committees Controller
 */
import Committee from "../models/Committee.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getPagination,
  buildPaginationResponse,
  getSorting,
  getFilters,
} from "../utils/pagination.js";

// @desc    Get all committees
// @route   GET /api/committees
export const getCommittees = asyncHandler(async (req, res) => {
  const { page, pageSize } = getPagination(req.query);
  const sort = getSorting(req.query);
  const filters = getFilters(req.query, ["committeeName", "type", "district"]);
  filters.isActive = { $ne: false };

  const aggregate = Committee.aggregate([{ $match: filters }, { $sort: sort }]);
  const result = await Committee.aggregatePaginate(aggregate, {
    page,
    limit: pageSize,
  });

  res.status(200).json({
    success: true,
    message: "Committees retrieved successfully",
    data: {
      committees: result.docs,
      totalCommittees: result.totalDocs,
      ...buildPaginationResponse(result.totalDocs, page, pageSize),
    },
  });
});

// @desc    Get single committee
// @route   GET /api/committees/:id
export const getCommitteeById = asyncHandler(async (req, res) => {
  const committee = await Committee.findById(req.params.id);
  if (!committee) {
    return res
      .status(404)
      .json({ success: false, message: "Committee not found" });
  }
  res.status(200).json({ success: true, data: committee });
});

// @desc    Create committee
// @route   POST /api/committees
export const createCommittee = asyncHandler(async (req, res) => {
  const committee = await Committee.create(req.body);
  res
    .status(201)
    .json({
      success: true,
      message: "Committee created successfully",
      data: committee,
    });
});

// @desc    Update committee
// @route   PUT /api/committees/:id
export const updateCommittee = asyncHandler(async (req, res) => {
  const committee = await Committee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!committee) {
    return res
      .status(404)
      .json({ success: false, message: "Committee not found" });
  }
  res
    .status(200)
    .json({
      success: true,
      message: "Committee updated successfully",
      data: committee,
    });
});

// @desc    Delete committee
// @route   DELETE /api/committees/:id
export const deleteCommittee = asyncHandler(async (req, res) => {
  const committee = await Committee.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!committee) {
    return res
      .status(404)
      .json({ success: false, message: "Committee not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Committee deleted successfully" });
});

// @desc    Get distinct committees for dropdown
// @route   GET /api/committees/distinct
export const getDistinctCommittees = asyncHandler(async (req, res) => {
  const committees = await Committee.aggregate([
    { $match: { isActive: { $ne: false } } },
    { $group: { _id: "$committeeName", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $sort: { committeeName: 1 } },
    { $project: { _id: 1, committeeName: 1, type: 1 } },
  ]);

  res.status(200).json({
    success: true,
    message: "Distinct committees retrieved successfully",
    data: { committees },
  });
});

// @desc    Create multiple committees in bulk
// @route   POST /api/committees/bulk
export const createBulkCommittees = asyncHandler(async (req, res) => {
  const { members } = req.body;

  if (!members || !Array.isArray(members) || members.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No valid members provided" });
  }

  const committees = await Committee.insertMany(members, { ordered: false });

  res.status(201).json({
    success: true,
    message: `${committees.length} committees created successfully`,
    data: { count: committees.length },
  });
});
