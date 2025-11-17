const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/statistics', courseController.getStatistics);
router.get('/:id', courseController.getCourseById);
router.get('/:id/students', courseController.getEnrolledStudents);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;