"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostHandler = exports.updatePostHandler = exports.getPostsHandler = exports.getPostHandler = exports.createPostHandler = exports.resizePostImage = exports.uploadPostImage = void 0;
const post_service_1 = require("../services/post.service");
const user_service_1 = require("../services/user.service");
const appError_1 = __importDefault(require("../utils/appError"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new multer_1.default.MulterError('LIMIT_UNEXPECTED_FILE'));
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5000000, files: 1 },
});
exports.uploadPostImage = upload.single('image');
const resizePostImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file;
        if (!file)
            return next();
        const user = res.locals.user;
        const fileName = `user-${user.id}-${Date.now()}.jpeg`;
        yield (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer)
            .resize(800, 450)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`${__dirname}/../../public/posts/${fileName}`);
        req.body.image = fileName;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.resizePostImage = resizePostImage;
const createPostHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.findUserById)(res.locals.user.id);
        const post = yield (0, post_service_1.createPost)(req.body, user);
        res.status(201).json({
            status: 'success',
            data: {
                post,
            },
        });
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'Post with that title already exist',
            });
        }
        next(err);
    }
});
exports.createPostHandler = createPostHandler;
const getPostHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield (0, post_service_1.getPost)(req.params.postId);
        if (!post) {
            return next(new appError_1.default(404, 'Post with that ID not found'));
        }
        res.status(200).json({
            status: 'success',
            data: {
                post,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getPostHandler = getPostHandler;
const getPostsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield (0, post_service_1.findPosts)({}, {}, {});
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getPostsHandler = getPostsHandler;
const updatePostHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield (0, post_service_1.getPost)(req.params.postId);
        if (!post) {
            return next(new appError_1.default(404, 'Post with that ID not found'));
        }
        Object.assign(post, req.body);
        const updatedPost = yield post.save();
        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updatePostHandler = updatePostHandler;
const deletePostHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield (0, post_service_1.getPost)(req.params.postId);
        if (!post) {
            return next(new appError_1.default(404, 'Post with that ID not found'));
        }
        yield post.remove();
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deletePostHandler = deletePostHandler;
