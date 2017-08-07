"use strict";

import chai from "chai";
import chaiHttp from "chai-http";

//
// Import all factories
//
import "~/spec/factories/credit_card";
import "~/spec/factories/order";
import "~/spec/factories/transaction";

chai.use(chaiHttp);