import { Router } from 'express';
import { userController } from './main';

const userRouter = Router();

userRouter.post('/login', userController.login);
userRouter.post('/register', userController.createUser);
userRouter.post('/forgot-password', userController.initiatePasswordReset);
userRouter.post('/reset-password', userController.resetPassword);
userRouter.post('/verify-reset-token', userController.verifyResetToken);

export default userRouter;

/**
 * @swagger
 *  tags:
 *    name: User
 *    description: User management endpoints
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       User:
 *         type: object
 *         required:
 *            - username
 *            - password
 *         properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *         example:
 *            username: Ayobami22@
 *            password: Ayobami22@
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       UserRegister:
 *         type: object
 *         required:
 *            - username
 *            - password
 *         properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *         example:
 *            username: Ayobami22@
 *            password: Ayobami22@
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       UserResponse:
 *         type: object
 *         properties:
 *            user:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                username:
 *                  type: string
 *                accountId:
 *                  type: integer
 *            token:
 *              type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       UserRegisterResponse:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *           username:
 *              type: string
 *           password:
 *               type: string
 *           accountId:
 *               type: integer
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       ForgotPasswordRequest:
 *         type: object
 *         required:
 *            - username
 *         properties:
 *            username:
 *              type: string
 *         example:
 *            username: Ayobami22@
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       ResetPasswordRequest:
 *         type: object
 *         required:
 *            - token
 *            - newPassword
 *         properties:
 *            token:
 *              type: string
 *            newPassword:
 *              type: string
 *         example:
 *            token: abc123-xyz456
 *            newPassword: NewSecure!123
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       VerifyTokenRequest:
 *         type: object
 *         required:
 *            - token
 *         properties:
 *            token:
 *              type: string
 *         example:
 *            token: abc123-xyz456
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       BasicResponse:
 *         type: object
 *         properties:
 *           message:
 *             type: string
 */

/**
 * @swagger
 *   /login:
 *      post:
 *        tags: [User]
 *        description: User login
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  $ref: '#/components/schemas/UserResponse'
 */

/**
 * @swagger
 *   /register:
 *      post:
 *        tags: [User]
 *        description: User registration
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/UserRegister'
 *        responses:
 *          201:
 *            description: CREATED
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  $ref: '#/components/schemas/UserRegisterResponse'
 */

/**
 * @swagger
 *   /forgot-password:
 *      post:
 *        tags: [User]
 *        description: Initiate password reset process
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/ForgotPasswordRequest'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  $ref: '#/components/schemas/BasicResponse'
 *          404:
 *            description: User not found
 */

/**
 * @swagger
 *   /reset-password:
 *      post:
 *        tags: [User]
 *        description: Reset user password with valid token
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/ResetPasswordRequest'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  $ref: '#/components/schemas/BasicResponse'
 *          400:
 *            description: Invalid or expired token
 */

/**
 * @swagger
 *   /verify-reset-token:
 *      post:
 *        tags: [User]
 *        description: Verify if a password reset token is valid
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/VerifyTokenRequest'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  $ref: '#/components/schemas/BasicResponse'
 *          400:
 *            description: Invalid or expired token
 */