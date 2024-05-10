import { Router } from 'express';
import { accountController } from './main';
import authMiddleware from '../middlewares/authMiddleware';

const accountRouter = Router();

accountRouter.get(
  '/account/:id',
  authMiddleware,
  accountController.balanceAccount,
);

export default accountRouter;

/**
 * @swagger
 *  tags:
 *    name: Account
 *    description: Endpoints for accessing bank account information.
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       AccountResponse:
 *         type: object
 *         properties:
 *            id:
 *              type: integer
 *              description: Unique identifier of the account
 *            balance:
 *              type: number
 *              format: double
 *              description: Current balance of the account
 */

/**
 * @swagger
 *   /account/{id}:
 *      get:
 *        tags: [Account]
 *        summary: Get account details by ID
 *        description: Returns account information including the current balance using the account ID.
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The ID of the account to retrieve
 *        security:
 *          - apiKey: []
 *        responses:
 *          200:
 *            description: Successful response with account data
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AccountResponse'
 */
