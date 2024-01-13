import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorhandler } from '../utils/error.js';


export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {


  if (!req.params.id) {
    return next(errorhandler(400, 'User ID is missing in the request.'));
  }

  if (req.user.userId !== req.params.id)
    return next(errorhandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            username: req.body.username,
            password: req.body.password,
            avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}; 


export const deleteUser = async (req, res, next) => {
  if (req.user.userId !== req.params.id)
    return next(errorhandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    next(error);
  }
};