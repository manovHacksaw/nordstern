---
title: "Retrieve Rates | Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks/get-rates"
author:
published: 2026-06-17
created: 2026-07-01
description: "Transactions that involve two non-equivalent on & off-chain assets (such as USDC on Stellar and fiat EUR) must"
tags:
  - "clippings"
---
## Retrieve Rates

```markdown
GET https://callback.business-server.exampleanchor.com/rate
```

Transactions that involve two non-equivalent on & off-chain assets (such as USDC on Stellar and fiat EUR) must use exchange rates that are communicated to the client application requesting the transaction. When clients make requests to the Platform for these exchange rates, the Platform sends this request to the anchor to fetch it.

Rates can be [indicative](https://www.investopedia.com/terms/i/indicativequote.asp) or [firm](https://www.investopedia.com/terms/f/firmquote.asp). The anchor must provide an ID and expiration if the client requests a firm rate.

Anchors can provide discounted rates specific client applications. The Platform includes the `client_id` parameter for this reason.

Either `sell_amount` or `buy_amount` will be included in requests as parameters, but never both. In the same way, either `sell_delivery_method` and `buy_delivery_method` may be included in requests, but never both, since either `sell_asset` or `buy_asset` is a Stellar asset.

Upon receiving the response, the Anchor Platform will validate the amount and price of the response.

If the validation fails, the Platform will respond to the client application's request with a HTTP status code of `502 Bad Gateway`.

The `sell_amount`, `buy_amount`, `price`, and `fee` are validated as follows:

- if `rate.fee` exists,
	- `rate.fee.asset` must have a positive value of `significant_decimals` defined in the asset configuration.
		- `rate.fee.total` must equal to the sum of `rate.fee.details.amount`.
		- if the `rate.fee.asset == rate.sell_asset`, `sell_amount ~= price * buy_amount + fee` must hold true.
		- if the `rate.fee.asset == rate.buy_asset`, `sell_amount ~= price * (buy_amount + fee)` must hold true.
- if `rate.fee` does not exist, `sell_amount ~= price * buy_amount` must hold true.

The `~=` is defined as equality within rounding error. The rounding error is defined as `10^(-significant_decimals)`

## Request

> [!-info] -info
> ### Query Parameters
> 
> **type** stringrequired
> 
> **Possible values:** \[`indicative`, `firm`\]
> 
> The type of rate requested. If `firm`, the response must include `rate.id` and `rate.expires_at`.
> 
> **client\_id** string
> 
> An identifier for the client application making the request. This ID can be used to offer different fees to different clients.
> 
> Client IDs will be the Stellar public key the public key used to authenticate via SEP-10. Anchors must ensure that the public key specified in the request matches a public key known to belong to the sending anchor.
> 
> This parameter will only be specified if the client is authenticated via SEP-10. Anchors can define whether or not authentication is required for fetching indicative rates. Firm rates always require authentication.
> 
> **sell\_asset** stringrequired
> 
> The asset the client application will send to the anchor in exchange for `buy_asset` in [Asset Identification Format](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0038.md#asset-identification-format).
> 
> **buy\_asset** stringrequired
> 
> The asset the that the anchor will send in exchange for `sell_asset` in [Asset Identification Format](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0038.md#asset-identification-format).
> 
> **sell\_amount** string
> 
> The amount of `sell_asset` the client application will send in exchange for `buy_asset`. Will not be used in conjunction with `buy_amount`.
> 
> **buy\_amount** string
> 
> The amount of `buy_asset` the anchor will send in exchange for `sell_asset`. Will not be used in conjunction with `sell_amount`.
> 
> **country\_code** string
> 
> The [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code of the user's current address. Anchors should expect this parameter to be provided if one of the assets of the buy/sell pair is fiat and it is available in two or more countries.
> 
> **expire\_after** string
> 
> The client's desired `expires_at` date and time for the quote that can be used if this is a firm quote. This should be a [UTC ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) string. Anchors should return `400 Bad Request` if an expiration date on or after the requested value cannot be provided.
> 
> **sell\_delivery\_method** string
> 
> The method the client or user will use to deliver `sell_asset` to the Anchor. This value may affect the expiration and price provided. The values used for this parameter is defined in the application's configuration. Will not be used in conjunction with `buy_delivery_method`.
> 
> **buy\_delivery\_method** string
> 
> The method the client or user wants used to receive `buy_asset` from the Anchor. This value may affect the expiration and price provided. The values used for this parameter is defined in the application's configuration. Will not be used in conjunction with `sell_delivery_method`.

## Responses

- 200
- 422
- 500

Success.

- application/json

> [!-info] -info
> **Schema**
> 
> > [!-info] -info
> > **rate** object

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