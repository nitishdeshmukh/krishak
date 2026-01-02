import LaborTeam from '../models/LaborTeam.js';

// Get all labor teams
export const getLaborTeams = async (req, res) => {
    try {
        const teams = await LaborTeam.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get labor team by ID
export const getLaborTeamById = async (req, res) => {
    try {
        const team = await LaborTeam.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new labor team
export const createLaborTeam = async (req, res) => {
    try {
        const team = await LaborTeam.create(req.body);
        res.status(201).json({ success: true, message: 'Team created successfully', data: team });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update labor team
export const updateLaborTeam = async (req, res) => {
    try {
        const team = await LaborTeam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, message: 'Team updated successfully', data: team });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete (soft) labor team
export const deleteLaborTeam = async (req, res) => {
    try {
        const team = await LaborTeam.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
