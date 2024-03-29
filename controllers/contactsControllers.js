import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });

    res.json(contacts || []);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({ _id: id, owner: req.user._id });
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    const deletedContact = await Contact.findOneAndDelete({
      owner: req.user._id,
    });

    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }
    res.json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
export const updateFavoriteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
