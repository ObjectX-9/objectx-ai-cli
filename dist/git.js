"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepo = cloneRepo;
exports.pullRepo = pullRepo;
exports.pushChanges = pushChanges;
const simple_git_1 = __importDefault(require("simple-git"));
const store_1 = require("./store");
const fs_extra_1 = __importDefault(require("fs-extra"));
async function cloneRepo() {
    await fs_extra_1.default.ensureDir(store_1.LOCAL_DIR);
    const git = (0, simple_git_1.default)(store_1.LOCAL_DIR);
    await git.clone(store_1.REPO_URL);
}
async function pullRepo() {
    const git = (0, simple_git_1.default)(store_1.REPO_DIR);
    await git.pull();
}
async function pushChanges(message) {
    const git = (0, simple_git_1.default)(store_1.REPO_DIR);
    await git.add('.');
    await git.commit(message);
    await git.push();
}
