---
title: "Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/sep-guide/sep6/integration"
author:
published: 2025-12-19
created: 2026-07-01
description: "One of the main points of interaction with the Anchor Platform is notifying the Platform about events related to transactions."
tags:
  - "clippings"
---
One of the main points of interaction with the Anchor Platform is notifying the Platform about events related to transactions.

In general, you will want to provide updates for the following events.

- Your business requires the user to submit KYC information to process a transaction
- Your business updated the in/out/fee amounts for a transaction
- Your business is ready to receive funds from the user
- Your business has received funds from the user
- Your business has sent funds to the user
- Your business has a processed a refund for the user's transaction
- Your business experienced an unexpected error

This is done by making JSON-RPC requests to the Platform API's endpoint. JSON-RPC requests allow you to update the status of the transaction. To move the transaction to a specific status, it's necessary to make a corresponding JSON-RPC request and pass data that is required by the RPC method.

The Anchor Platform JSON-RPC API is designed to notify the platform about changes in the status of the transaction. Given that, the API will be called every time a user or the anchor takes any action that progresses the transaction status in the flow.

Communication from the Anchor Platform about transaction updates, customer updates, and quote creation is handled through the event service. This is an optional feature that needs to be configured separately from the SEP-6 integration. For more information, see [Event Handling](https://developers.stellar.org/docs/platforms/anchor-platform/admin-guide/events).

You can find out more about transaction flow and statuses in the [SEP-6 protocol document](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md).

## Callbacks

The Anchor Platform relies on the business server to provide and store information about customers and quotes.

### Customer Information

The Anchor Platform does not store customer information. Instead, it forwards all SEP-12 customer requests to the business server. The business server is responsible for storing and managing this information. Therefore, your business server must implement the [customer APIs](https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks) to handle KYC updates.

### Quotes and Fees

To support the exchange of non-equivalent assets, the Anchor Platform exposes a SEP-38 compliant API to provide quotes for the exchange. The quote API is used to provide the user with the expected amount of the asset they will receive in exchange for the asset they are sending. The quote API is also used to provide the user with the expected fees for the transaction. Therefore, your business server must implement the [rate API](https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks) to provide quotes to the Anchor Platform.

## Securing Platform API

> [!-warning] -warning
> caution
> 
> By default, the Platform API's endpoints such as `GET /transactions` and `GET /transactions/:id` are not protected, and are accessible by anyone who has access to the server, including wallet applications.

> [!-info] -info
> info
> 
> It's recommended to keep Platform server accessible only from the private network. However, you may want to add additional layer of protection via securing the API.

### Using API Key

To enable API key authentication, modify your `dev.env` file:

- bash

```bash
# dev.env
PLATFORM_API_AUTH_TYPE=api_key
# Will be used as API key
SECRET_PLATFORM_API_AUTH_SECRET="your API key that business server will use"
```

Once enabled, all requests must include a valid `X-Api-Key` header, set to the configured API key.

### Using JWT

To enable JWT authentication, modify your `dev.env` file:

- bash

```bash
# dev.env
PLATFORM_API_AUTH_TYPE=jwt
# Will be used to sign the JWT token
SECRET_PLATFORM_API_AUTH_SECRET="your secret that business server will use"
```

Anchor Platform uses the HMAC SHA-256 (HS256) algorithm to sign JWT tokens. Ensure that `SECRET_PLATFORM_API_AUTH_SECRET` is at least 32 characters long for security.

Once enabled, all requests must include a valid `Authorization` header with the format `Bearer <JWT token>`.

## Making JSON-RPC Requests

Before making JSON-RPC requests, let's first create a template for making a request to the Anchor Platform.

- bash

```bash
# call-json-rpc.sh
#!/usr/bin/env bash

curl localhost:8085 \
    -X POST \
    -H 'Content-Type: application/json' \
    --data "@$1"
```

This small script will make a JSON-RPC request to the Anchor Platform hosted on the default port (8085). JSON transaction data stored in the provided file will be used as body (requests must be an array).

### JSON-RPC Request

The Request object must contain the following attributes:

- ATTRIBUTEDATA TYPE
	DESCRIPTION
- jsonrpcstring
	A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0"
- methodstring
	A String containing the name of the method to be invoked. List of available methods you can see in \[JSON-RPC Methods\]\[json-rpc-methods\]
- paramsobject
	A Structured value that holds the parameter values, corresponding to method call, to be used during the invocation of the method
- idstring
	An identifier established by the client. The Server will reply with the same value in the Response object

> [!-success] -success
> tip
> 
> It's possible to provide multiple updates in a single JSON-RPC request (by placing multiple JSON-RPC request objects). When an update is done in this way, all updates will be done sequentially.
> 
> Most importantly, each JSON-RPC request is not atomic. If one update fails, all previous updates WILL be applied and all subsequent updates WILL be processed and applied as well.

### JSON-RPC Response

The Response is expressed as a single JSON Object, with the following attributes:

- ATTRIBUTEDATA TYPE
	DESCRIPTION
- jsonrpcstring
	A String specifying the version of the JSON-RPC protocol. It's set to "2.0"
- resultobject
	A Structured value that holds the updated transaction details
- idstring
	An identifier sent by the client
- errorobject
	A Structured value that holds the error details
	> [!-info] -info
	> Show child attributes

### Error Codes

| Error code | Meaning |
| --- | --- |
| \-32600 | The JSON sent is not a valid Request object |
| \-32601 | The method does not exist / is not available |
| \-32602 | Invalid method parameter(s) |
| \-32603 | Internal JSON-RPC error |

> [!-success] -success
> tip
> 
> We will also reference a `$transaction_id` variable. This is an identification of transaction that is being returned from the Anchor Platform on an withdrawal or deposit start request. You can obtain the transaction ID by connecting the test wallet to your local Anchor Platform instance.

## Updating Deposit (Exchange) Transaction Via JSON-RPC

SEP-6 deposit flow diagram defines sequences/rules of the transaction's status transition and a set of JSON-RPC method that should be called to change that status. You can't define the status you want to set for a specific transaction in your requests. Each JSON-RPC method defines data structures that it expects in request. If request doesn't contain a required attributes, the Anchor Platform will return and error and won't change status of the transaction.

The deposit exchange flow is the same as the deposit flow, except the amounts will not need to be recalculated when requesting offchain funds, if the user has provided a firm quote from the anchor.

[![sep6 deposit flow](https://developers.stellar.org/assets/images/sep6-deposit-flow-diagram-6c1e1c97838aa562372675b148bb3711.png)](https://developers.stellar.org/assets/files/sep6-deposit-flow-diagram-6c1e1c97838aa562372675b148bb3711.png)

> [!-success] -success
> tip
> 
> Statuses in green are mandatory and define the shortest way.
> 
> Statuses in yellow are optional and can be skipped.
> 
> Statuses in red mean the transaction is in an error status or it has expired.

### Verifying KYC Information

Although Anchor Platform does not require a customer to have their KYC information collected before initiating a deposit, your business may want to collect this information before the customer makes a transfer. By listening to transaction created events, or by polling the [`GET /transactions`](https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/platform/transactions/get-transactions) endpoint, you can require determine if a transaction requires the customer to update their information. The required SEP-9 fields can be communicated to the user by returning a `NEEDS_INFO` status with the required fields in the `fields` attribute.

After the user has submitted their KYC information, call the `notify_customer_info_updated` JSON-RPC method againto update the transaction status. Additionally, call this method whenever the SEP-12 status for a customer changes, such as when the customer's information is being validated and the status changes from `NEEDS_INFO` to `PROCESSING`. This ensures that any clients configured with a callback URL are notified of the latest customer status, allowing the client to prompt the user to update their information.

- JSON

```json
// notify-customer-info-updated.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_customer_info_updated",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Customer info updated",
      "customer_id": "45f8884d-d6e1-477f-a680-503179263359",
      "customer_type": "sep6-deposit" // or sep6-withdrawal
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh notify-customer-info-updated.json
```

### Ready to Receive Funds

After the user has submitted their KYC information, the anchor can notify the Platform that they are ready to receive funds. The anchor should use the `request_offchain_funds` RPC to provide the final amounts to the user. To do so, make the following JSON-RPC request.

- JSON

```json
// request-offchain-funds.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "request_offchain_funds",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Request offchain funds",
      "amount_in": {
        "amount": 10,
        "asset": "iso4217:USD"
      },
      "amount_out": {
        "amount": 9,
        "asset": "stellar:USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
      },
      "fee_details": {
        "total": 1,
        "asset": "iso4217:USD"
      },
      "amount_expected": {
        "amount": 10
      },
      "instructions": {
        "organization.bank_number": {
          "value": "123456789",
          "description": "US Bank routing number"
        },
        "organization.bank_account_number": {
          "value": "123456789",
          "description": "US Bank account number"
        }
      }
    }
  }
]
```

- `amount_in` is the amount the user has to send to the business.
- `amount_out` is the amount the user will receive.
- `fee_details` is the total amount of fees collected by the business.
- `asset` is part of the `amount_x` field and is in a SEP-38 format. In this example, it's set to USD, assuming the user made a bank transfer to the system using USD.
- `instructions` is the set of SEP-9 standard fields that user should use to send funds to the business. In this example, the user should send funds to the bank account with the routing number `123456789` and account number `123456789`.

Information about amounts (in/out/fee) is required if you want to move the transaction to the `pending_user_transfer_start` status.

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh request-offchain-funds.json
```

> [!-warning] -warning
> caution
> 
> For exchange deposits with a firm quote (the request is associated with a `quote_id`), no amounts should not be provided.

### Funds Received

If offchain funds were received, you'll want to provide updated transaction information.

- JSON

```json
// offchain-funds-received.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_offchain_funds_received",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Offchain funds received",
      "funds_received_at": "2023-07-04T12:34:56Z",
      "external_transaction_id": "7...9",
      "amount_in": {
        "amount": 10
      },
      "amount_out": {
        "amount": 9
      },
      "fee_details": {
        "total": 1
      },
      "amount_expected": {
        "amount": 10
      }
    }
  }
]
```

- `funds_received_at` is the date and time of receiving funds.
- `external_transaction_id` is the ID of transaction on external network.

The amount fields are optional. If skipped, the values prior to this request will be used.

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh offchain-funds-received.json
```

### Waiting For User Funds

In the real world, the transfer confirmation process may take time. In such cases, transactions should be set to a new status indicating that the confirmation of the transfer has been received but the funds themselves have not been received yet.

- JSON

```json
// offchain-funds-sent.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_offchain_funds_sent",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Offchain funds sent",
      "funds_received_at": "2023-07-04T12:34:56Z",
      "external_transaction_id": "7...9"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh offchain-funds-sent.json
```

### Sending Onchain Funds

Next, send a transaction on the Stellar network to fulfill the user deposit. After the Stellar transaction has been submitted, it's necessary to send the `notify_onchain_funds_sent` JSON-RPC request to notify a user that the funds were successfully sent.

- JSON

```json
// onchain-funds-sent.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_onchain_funds_sent",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Onchain funds sent",
      "stellar_transaction_id": "7...9"
    }
  }
]
```

- `stellar_transaction_id` is the transaction id on Stellar network of the transfer.

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh onchain-funds-sent.json
```

After this JSON-RPC request, the transaction will be transferred to the `completed` status.

### Pending Trust

This status has to be set if a payment requires an asset trustline that wasn't configured by the user. There are two ways of how the transaction may be moved to the `pending_trust` status. The first one is when the business server detects that the trustline isn't configured. The second one is when the business itself detects that the trustline is missing and wants to notify the user that it has to be configured. To move the transaction to the `pending_trust` status, make the following JSON-RPC request.

- JSON

```json
// request-trust.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "request_trust",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Asset trustine not configured"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh request-trust.json
```

> [!-info] -info
> info
> 
> The payment processing system periodically checks if the trustline was configured. If it was, it will automatically send a payment and change the status of the transaction to `pending_stellar`.

### Trust Set

This status has to be set if the business has detected that the trustline was or wasn't configured by user.

- JSON

```json
// trust-set.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_trust_set",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Asset trustine set",
      "success": "true"
    }
  }
]
```

- `success` flag which defines if trustline was or wasn't configured by user

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh trust-set.json
```

> [!-info] -info
> info
> 
> Depending on the `success` flag, the status of the transaction will be changed to `pending_stellar` if the trustline was set, or to `pending_anchor` if it wasn't.

### Refund Sent

Sometimes, funds need to be sent back to the user (refund). You can refund the whole sum (full refund) or do a set of partial refunds back to the `source_account` using the `refund_memo` and `refund_memo_type` associated with the transaction if present. Also, if user sent more money than expected, you can refund a part of the sum back to the user and send the rest as onchain funds.

- JSON

```json
// refund-sent.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_refund_sent",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Refund sent",
      "refund": {
        "id": "1c186184-09ee-486c-82a6-aa7a0ab1119c",
        "amount": {
          "amount": 10,
          "asset": "iso4217:USD"
        },
        "fee_details": {
          "total": 1,
          "asset": "iso4217:USD"
        }
      }
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh refund-sent.json
```

> [!-info] -info
> info
> 
> If a sum of refunds is less than `amount_in`, the status of the transaction will be set to `pending_anchor`. Only if the sum of refunds is equal to `amount_in`, the status of the transaction will be set to `refunded`.

### Refund Pending

This is similar to [Refund Sent](#refund-sent), but it handles the case when a refund has been submitted to external network but is not yet confirmed. The status of the transaction is set to `pending_external`. This is the status that will be set when waiting for Bitcoin or other external crypto network to complete a transaction, or when waiting for a bank transfer.

### Transaction Error

If you encounter an unrecoverable error when processing the transaction, it's required to set the transaction status to `error`. You can use the message field to describe the error details.

- JSON

```json
// transaction-error.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_transaction_error",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Error occurred"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh transaction-error.json
```

> [!-success] -success
> tip
> 
> If a user has made a transfer, you should do a transaction recovery, and then you can retry processing the transaction or initiate a refund.

### Expired Transaction

Your business may want to handle abandoned transactions by expiring those have remained inactive for a certain period. To achieve this, check the transaction status using the `GET /transactions` endpoint and sort the results by the `user_action_required_by` timestamp. If the timestamp has passed, manually execute the appropriate logic, such as expiring the transaction or initiating an auto-refund, based on the transaction's current status.

- JSON

```json
// transaction-expired.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_transaction_expired",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Transaction expired"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh transaction-expired.json
```

> [!-success] -success
> tip
> 
> This JSON-RPC method can't be used after the user has made a transfer.

### Transaction Recovery

Transaction status can be changed from `error/expired` to `pending_anchor`. After recovery, you can refund the received assets or proceed with processing of the transaction. To recover a transaction, make the following JSON-RPC request.

- JSON

```json
// transaction-recovery.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_transaction_recovery",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Transaction recovered"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh transaction-recovery.json
```

## Updating Withdrawal (Exchange) Transaction Via JSON-RPC

The SEP-6 withdrawal flow diagram defines the sequence/rules of the transaction's status transition. You can't define the status you want to set for a specific transaction in your requests. Each JSON-RPC method defines data structures that it expects in request. If request doesn't contain a required attributes, the Anchor Platform will return and error and won't change status of the transaction.

The withdrawal exchange flow is the same as the withdrawal flow, except the amounts will not need to be recalculated when requesting onchain funds, if the user has provided a firm quote from the anchor.

[![sep6 withdrawal flow](https://developers.stellar.org/assets/images/sep6-withdrawal-flow-diagram-752a257f2503464caa1aecdd87faeadc.png)](https://developers.stellar.org/assets/files/sep6-withdrawal-flow-diagram-752a257f2503464caa1aecdd87faeadc.png)

> [!-success] -success
> tip
> 
> Statuses in green are mandatory and define the shortest way.
> 
> Statuses in yellow are optional and can be skipped.
> 
> Statuses in red mean the transaction is in an error status or it has expired.

Once the withdrawal flow is finished, implementing the withdrawal is straightforward. Some parts of the flow are similar and can be reused.

The starting point both for withdrawal and for deposit is the same.

### Ready to Receive Funds

Similarly to deposit, the step after KYC has been collected is to notify the user that the anchor is ready to receive funds. However, as your service will be receiving transactions over the Stellar network, the RPC request will be different. The anchor should use the `request_onchain_funds` RPC to provide the final amounts to the user. To do so, make the following JSON-RPC request.

- JSON

```json
// request-onchain-funds.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "request_onchain_funds",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Request onchain funds",
      "amount_in": {
        "amount": 10,
        "asset": "stellar:USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
      },
      "amount_out": {
        "amount": 9,
        "asset": "iso4217:USD"
      },
      "fee_details": {
        "total": 1,
        "asset": "stellar:USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
      },
      "amount_expected": {
        "amount": 10
      },
      "destination_account": "GD...G",
      "memo": "12345",
      "memo_type": "id"
    }
  }
]
```

- `amount_in` is the amount the user has to send to the business.
- `amount_out` is the amount the user will receive.
- `fee_details` is the total amount of fees collected by the business.
- `asset` is part of the `amount_x` field and is in a SEP-38 format. In this example, it's set to USD, assuming the user made a bank transfer to the system using USD.
- `memo` is the memo the user should use when sending their onchain funds to the anchor.
- `memo_type` is the memo type the user should use when sending their onchain funds to the anchor.
- `destination_account` is the account the user should send the funds to.

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh request-onchain-funds.json
```

> [!-warning] -warning
> caution
> 
> For exchange withdrawals with a firm quote (the request is associated with a `quote_id`), no amounts should not be provided.

> [!-success] -success
> tip
> 
> Setting `memo`, `memo_type`, and `destination_account` is optional.
> 
> If integration with a third-party custodian is enabled, the Anchor Platform can generate `memo`, `memo_type`, and `destination_address` if a corresponding `deposit_info_generator_type` is chosen. Also, you can provide `memo` and `memo_type` to the request as shown above. Note that the memo must be unique, this is what helps to associate Stellar transactions with SEP transactions.
> 
> If your business manages the assets, the Anchor Platform can generate memos for you. When the status is changed to `pending_user_transfer_start`, the Anchor Platform sets the `memo` and `memo_type` automatically (only if it's not included in the request).

> [!-secondary] -secondary
> note
> 
> The Stellar account that will be used to receive funds should be configured.

### Funds Received

If onchain funds were received, you need to provide amounts and change the status of the transaction to `pending_anchor`.

- JSON

```json
// onchain-funds-received.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_onchain_funds_received",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Onchain funds received",
      "stellar_transaction_id": "7...9",
      "amount_in": {
        "amount": 10
      },
      "amount_out": {
        "amount": 9
      },
      "fee_details": {
        "total": 1
      }
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh onchain-funds-received.json
```

> [!-success] -success
> tip
> 
> This method will be called by the Stellar payment observer when it detects that onchain funds have been received.

### Amount Updated

If onchain funds were received, but for some reason the `amount_in` differs from specified in the interactive flow (`amount_expected`), you can update `amount_out` and `fee_details` to make them correspond to the actual `amount_in`. The status of the transaction in this case won't be changed and will be equal to `pending_anchor`.

- JSON

```json
// amounts-updated.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_amounts_updated",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Amounts updated",
      "amount_out": {
        "amount": 9
      },
      "fee_details": {
        "total": 1
      }
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh amounts-updated.json
```

> [!-secondary] -secondary
> note
> 
> Only `amount_out` and `fee_details` can be updated using this JSON-RPC request, and you don't need to specify the assets of the amounts.

### Offchain Funds Available

You can move transaction status to `pending_user_transfer_complete` if offchain funds were sent, and if it's ready for the user / recipient to pick it up.

- JSON

```json
// offchain-funds-available.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_offchain_funds_available",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Offchain funds available",
      "external_transaction_id": "a...c"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh offchain-funds-available.json
```

### Offchain Funds Pending

Another option is to move the transaction's status to `pending_external`. This status means that the payment has been submitted to an external network, but is not yet confirmed.

- JSON

```json
// offchain-funds-pending.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_offchain_funds_pending",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Offchain funds pending",
      "external_transaction_id": "a...c"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh offchain-funds-pending.json
```

### Offchain Funds Sent

To complete the transaction and change its status to `completed`, you need to make the `notify_offchain_funds_sent` JSON-RPC request.

- JSON

```json
// offchain-funds-sent.json
[
  {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "notify_offchain_funds_sent",
    "params": {
      "transaction_id": "<transaction_id>",
      "message": "Offchain funds sent",
      "funds_sent_at": "2023-07-04T12:34:56Z",
      "external_transaction_id": "a...c"
    }
  }
]
```

To execute this, you need to run:

- bash

```bash
./call-json-rpc.sh offchain-funds-sent.json
```

### Refund Sent

The refund logic works in the same way as for the deposit flow. For more details, see [Refund Sent](#refund-sent) of the deposit flow.

### Transaction Error

Works in the same manner as for the deposit flow. For more details, see [Transaction Error](#transaction-error) of the deposit flow.

### Expired Transaction

Works in the same manner as for the deposit flow. For more details, see [Expired Transaction](#expired-transaction) of the deposit flow.

### Transaction Recovery

Works in the same manner as for the deposit flow. For more details, see [Transaction Recovery](#transaction-recovery) of the deposit flow.

## Tracking Stellar Transactions

Using the Payment Observer allows you to delegate this step to the Anchor Platform. To enable the Payment Observer, use the `--stellar-observer` flag in the command section of the [compose file](https://developers.stellar.org/docs/platforms/anchor-platform/admin-guide/getting-started#configuration).

The Payment Observer will track all transactions sent to the distribution account. When the transaction with the expected memo is detected in the network, the status will automatically change to `pending_anchor` and event will be the emitted (if Kafka is used).

In order to update the transaction's statuses, the observer makes corresponding JSON-RPC requests to the platform. It should use the following URL.

- bash

```bash
# dev.env
PLATFORM_API_BASE_URL=http://platform-server:8085
```

> [!-warning] -warning
> caution
> 
> The Payment Observer won't validate the amounts. It's your responsibility to verify that the amount sent by the user is correct.

> [!-info] -info
> info
> 
> If you already have a system that monitors payments, make sure that the logic of the system matches the description below:
> 
> First, wait for the transaction to be included in the ledger (using an SDK). This transaction must have the expected memo and destination address (distribution account). Once this transaction has been detected and verified, notify the user that the funds have been received using the [notify\_onchain\_funds\_received](#funds-received-1) JSON-RPC request.