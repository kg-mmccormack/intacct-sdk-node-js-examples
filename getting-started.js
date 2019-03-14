/**
 * Copyright 2018 Sage Intacct, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "LICENSE" file accompanying this file. This file is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

gettingStarted();

async function gettingStarted() {
    const bootstrap = require("./bootstrap");
    const IA = require("@intacct/intacct-sdk");
    let logger = bootstrap.logger();

    try {
        const client = bootstrap.client(logger);

        let query = new IA.Functions.Common.ReadByQuery();
        query.objectName = "VENDOR";
        query.pageSize = 1; // Keep the count to just 1 for the example
        query.fields = [
            "RECORDNO",
            "VENDORID",
            "NAME",
        ];

        logger.info("Executing query to Intacct API");

        const response = await client.execute(query);
        const result = response.getResult();

        logger.debug("Query successful", {
            "Company ID": response.authentication.companyId,
            "User ID": response.authentication.userId,
            "Request control ID": response.control.controlId,
            "Function control ID": result.controlId,
            "Data": result.data,
        });

        console.log("Success! Number of vendor objects found: " + result.totalCount.toString());

    } catch (ex) {
        if (ex instanceof IA.Exceptions.ResponseException) {
            logger.error("An Intacct response exception was thrown", {
                "Class": ex.constructor.name,
                "Message": ex.message,
                "API Errors": ex.errors,
            });
            console.log("Failed! " + ex.message);
        } else {
            logger.error("An exception was thrown", {
                "Class": ex.constructor.name,
                "Message": ex.message,
            });
            console.log(ex.name)
        }
    }
}
