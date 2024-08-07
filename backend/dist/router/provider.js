"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/signin', (req, res) => {
    res.json({ message: 'hi from provider' });
});
exports.default = router;
