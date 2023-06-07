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

import * as mt910MsgType from "../lib/mt910";
import tags from "../lib/tags";
import * as helpers from "../lib/helperModels";
import BigNumber from "bignumber.js";
import { Statement } from "../lib/statement";

///////////////////////////////////////////////////////////////////////////////
// TESTS
///////////////////////////////////////////////////////////////////////////////

describe("MT910 Message Type", () => {
  it("buildStatement", () => {
    const group = [
      new tags.TagTransactionReferenceNumber("0000320568"),
      new tags.TagRelatedReference("0000320568"),
      new tags.TagAccountIdentification("4047710139"),
      new tags.TagDateTimeIndication("1908131336+0200"),
      new tags.TagDateCurrencyAmount("190813ZAR420198,79"),
      new tags.TagOrderingInstitution("ABSAZAJJXXX"),
      new tags.TagIntermediary("BKTRUS33"),
      new tags.TagSenderToReceiverInformation(
        "0000  320568\n/NCOL/TCN\n/NPF CREDIT    \n/000010005"
      ),
    ];

    let result = mt910MsgType.buildStatement({ group });

    const expected = new Statement({
      transactionReference: "0000320568",
      relatedReference: "0000320568",
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
        "0000  320568/NCOL/TCN/NPF CREDIT    /000010005",
      messageBlocks: {},
      intermediary: "BKTRUS33",
    } as Statement);

    expect(result.transactionReference).toEqual(expected.transactionReference);
    expect(result.relatedReference).toEqual(expected.relatedReference);
    expect(result.accountIdentification).toEqual(
      expected.accountIdentification
    );
    // expect(result.statementDate).toEqual(expected.statementDate);
    expect(result.intermediary).toEqual(expected.intermediary);
    expect(result.dateCurrencyAmount).toEqual(expected.dateCurrencyAmount);
    expect(result.orderingInstitution).toEqual(expected.orderingInstitution);
    expect(result.senderToReceiverInformation).toEqual(
      expected.senderToReceiverInformation
    );
  });
});
