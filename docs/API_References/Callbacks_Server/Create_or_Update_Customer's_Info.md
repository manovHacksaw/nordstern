---
title: "Create or Update Customer Info"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks/put-customer"
author:
published: 2026-06-17
created: 2026-07-01
description: "**The Anchor Platform does not persist any customer KYC data.**"
tags:
  - "clippings"
---
```markdown
PUT https://callback.business-server.exampleanchor.com/customer
```

**The Anchor Platform does not persist any customer KYC data.**

The request and response for this endpoint are identical to the [`PUT /customer`](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#customer-put) request and response defined in SEP-12.

Client applications make requests with the following request body, which is forwarded to the anchor. Anchors must validate and persist the data passed, and return the customer's `id`. Requests containing only string fields will be forwarded to the anchor as with the `application/json` content type. Requests containing binary fields will be forwarded to the anchor as with the `multipart/form-data` content type.

## Request

- application/json
- multipart/form-data

> [!-info] -info
> ### Body
> 
> **id** string
> 
> The ID of the customer as returned in the response of a previous PUT request.
> 
> **account** string
> 
> The Stellar or Muxed Account authenticated with the Platform via SEP-10.
> 
> **memo** string
> 
> The memo value identifying a customer with a shared account, where the shared account is `account`.
> 
> **memo\_type** string
> 
> The type of memo used to identify a customer with a shared account.
> 
> **Possible values:** \[`id`, `hash`, `text`\]
> 
> **type** string
> 
> The type of action the customer is being KYCd for. See the [Type Specification](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#type-specification) documented in SEP-12 for more info. For SEP-31 you can define your own types in the assets configuration. For SEP-24 pre-defined value `sep24-customer` is used.
> 
> **transaction\_id** string
> 
> The transaction id with which the customer's info is associated. When information from the customer depends on the transaction (e.g., more information is required for larger amounts)
> 
> **first\_name** string
> 
> **last\_name** string
> 
> **additional\_name** string
> 
> **address\_country\_code** string
> 
> **state\_or\_province** string
> 
> **city** string
> 
> **postal\_code** string
> 
> **address** string
> 
> **mobile\_number** string
> 
> **email\_address** string
> 
> **birth\_date** date
> 
> **birth\_place** string
> 
> **birth\_country\_code** string
> 
> **bank\_name** string
> 
> **bank\_account\_number** string
> 
> **bank\_account\_type** string
> 
> **bank\_number** string
> 
> **bank\_phone\_number** string
> 
> **bank\_branch\_number** string
> 
> **external\_transfer\_memo** string
> 
> **clabe\_number** string
> 
> **cbu\_alias** string
> 
> **mobile\_money\_number** string
> 
> **mobile\_money\_provider** string
> 
> **crypto\_address** string
> 
> **crypto\_memo** string
> 
> Deprecated. Use `external_transfer_memo` instead.
> 
> **tax\_id** string
> 
> **tax\_id\_name** string
> 
> **occupation** string
> 
> **employer\_name** string
> 
> **employer\_address** string
> 
> **language\_code** string
> 
> **id\_type** string
> 
> **id\_country\_code** string
> 
> **id\_issue\_date** date
> 
> **id\_expiration\_date** date
> 
> **id\_number** string
> 
> **ip\_address** string
> 
> **sex** string
> 
> **referral\_id** string
> 
> **mobile\_number\_verification** string
> 
> **email\_address\_verification** string

- csharp
- curl
- dart
- go
- http
- java
- javascript
- kotlin
- c
- nodejs
- objective-c
- ocaml
- php
- postman-cli
- powershell
- python
- r
- ruby
- rust
- shell
- swift

- HTTPCLIENT
- RESTSHARP