import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user._id, req.body);
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) { next(error); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await authService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) { next(error); }
};