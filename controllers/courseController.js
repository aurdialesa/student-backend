const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  try {
    const { department } = req.query;
    const courses = await Course.findAll({ department });
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Error retrieving courses' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, message: 'Error retrieving course' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: 'Error creating course' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.update(req.params.id, req.body);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, message: 'Error updating course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.delete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const students = await Course.getEnrolledStudents(req.params.id);
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ success: false, message: 'Error retrieving enrolled students' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const stats = await Course.getStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, message: 'Error retrieving statistics' });
  }
};