/*
 *  Copyright 2016 Alexander Tsybulsky and other contributors
 *  Copyright 2020 Centrapay and other contributors
 *  Copyright 2023 Stitch and other contributors
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as mt900MsgType from "../lib/mt900";
import tags from "../lib/tags";
import * as helpers from "../lib/helperModels";
import BigNumber from "bignumber.js";
import { Statement } from "../lib/statement";

///////////////////////////////////////////////////////////////////////////////
// TESTS
///////////////////////////////////////////////////////////////////////////////

describe("MT900 Message Type", () => {
  it("buildStatement", () => {
    const group = [
      new tags.TagTransactionReferenceNumber("0000000000CONTRA"),
      new tags.TagRelatedReference("0000000000CONTRA"),
      new tags.TagAccountIdentification("4047710139"),
      new tags.TagDateTimeIndication("1908131336+0200"),
      new tags.TagDateCurrencyAmount("190813ZAR420198,79"),
      new tags.TagOrderingInstitution("ABSAZAJJXXX"),
      new tags.TagSenderToReceiverInformation(
        "0000000000 CONTRA-0002167016\n/NDDT/AKD\n/ACB CONTRA      \n/000010000"
      ),
    ];

    let result = mt900MsgType.buildStatement({ group });

    const expected = new Statement({
      transactionReference: "0000000000CONTRA",
      relatedReference: "0000000000CONTRA",
      accountIdentification: "4047710139",
      statementDate: helpers.Date.forOffsetDateTime({
        date: "190813",
        time: "1336",
        offset: "+0200",
      }),
      dateCurrencyAmount: {
        valueDate: helpers.Date.parse("19", "08", "13"),
        currencyCode: "ZAR",
        amount: BigNumber(420198.79),
      },
      orderingInstitution: "ABSAZAJJXXX",
      senderToReceiverInformation:
        "0000000000 CONTRA-0002167016/NDDT/AKD/ACB CONTRA      /000010000",
      messageBlocks: {},
    } as Statement);

    expect(result.transactionReference).toEqual(expected.transactionReference);
    expect(result.relatedReference).toEqual(expected.relatedReference);
    expect(result.accountIdentification).toEqual(
      expected.accountIdentification
    );
    expect(result.statementDate).toEqual(expected.statementDate);
    expect(result.dateCurrencyAmount).toEqual(expected.dateCurrencyAmount);
    expect(result.orderingInstitution).toEqual(expected.orderingInstitution);
    expect(
      result.senderToReceiverInformation?.replace(/(\r\n|\r|\n)/g, "")
    ).toEqual(
      expected.senderToReceiverInformation?.replace(/(\r\n|\r|\n)/g, "")
    );
  });
});
