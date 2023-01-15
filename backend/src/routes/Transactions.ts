import { Router } from 'express';
import { transactionController } from './main';

const transactionRouter = Router();

const URL = '/transactions';

transactionRouter.get(URL, transactionController.allTransactions);
transactionRouter.get(`${URL}/cashin`, transactionController.cashIn);
transactionRouter.get(`${URL}/cashout`, transactionController.cashOut);
transactionRouter.post(`${URL}/new`, transactionController.createTransaction);

export default transactionRouter;

/**
 * @swagger
 *  tags:
 *    name: Transactions
 *    description: Banking transaction endpoints
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       NewTransaction:
 *         type: object
 *         required:
 *            - username
 *            - value
 *         properties:
 *            username:
 *              type: string
 *            value:
 *              type: number
 *              format: double
 *         example:
 *            username: peterparker
 *            value: 120.25
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       TransactionResponse:
 *         type: object
 *         properties:
 *            id:
 *              type: integer
 *            value:
 *              type: number
 *              format: double
 *            debitedAccountId:
 *              type: integer
 *            creditedAccountId:
 *              type: integer
 *            createdAt:
 *              type: string
 *            debitedUser:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *            creditedUser:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *       NewTransactionResponse:
 *         type: object
 *         properties:
 *            createdAt:
 *              type: string
 *            id:
 *              type: integer
 *            value:
 *              type: number
 *              format: double
 *            debitedAccountId:
 *              type: integer
 *            creditedAccountId:
 *              type: integer
 */

/**
 * @swagger
 *   /transactions:
 *      get:
 *        tags: [Transactions]
 *        description: Returns all transactions of a bank account
 *        security:
 *          - apiKey: []
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  $ref: '#/components/schemas/TransactionResponse'
 */

/**
 * @swagger
 *   /transactions/cashin:
 *      get:
 *        tags: [Transactions]
 *        description: Returns all received transactions of a user
 *        security:
 *          - apiKey: []
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  $ref: '#/components/schemas/TransactionResponse'
 */

/**
 * @swagger
 *   /transactions/cashout:
 *      get:
 *        tags: [Transactions]
 *        description: Returns all sent transactions of a user
 *        security:
 *          - apiKey: []
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  $ref: '#/components/schemas/TransactionResponse'
 */

/**
 * @swagger
 *   /transactions/new:
 *      post:
 *        tags: [Transactions]
 *        description: Creates a new bank transaction
 *        security:
 *          - apiKey: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/NewTransaction'
 *        responses:
 *          201:
 *            description: Created
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  $ref: '#/components/schemas/NewTransactionResponse'
 */
