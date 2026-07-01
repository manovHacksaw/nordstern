---
title: "Getting Started | Stellar Docs"
source: "https://developers.stellar.org/docs/platforms/anchor-platform/admin-guide/events/getting-started"
author:
published: 2025-12-09
created: 2026-07-01
description: "Anchor Platform provides an event service that sends HTTP webhook notifications to:"
tags:
  - "clippings"
---
**Business Servers**

Event schemas for business servers are defined in the [API reference](https://developers.stellar.org/docs/platforms/anchor-platform/api-reference/callbacks/post-event).

**Client Applications**

*Event schemas for client applications are defined in their respective SEPs:*

- [SEP-6 Transaction Events](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md#single-historical-transaction)
- [SEP-12 Customer Events](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0012.md#response)
- [SEP-24 Transaction Events](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md#single-historical-transaction)
- [SEP-31 Transaction Events](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md#get-transaction)

This eliminates the need for business servers and client applications to continuously poll the APIs for updates.