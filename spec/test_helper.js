"use strict";

import chai from "chai";
import chaiHttp from "chai-http";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";

//
// Import all factories
//
import "~/spec/factories/credit_card";
import "~/spec/factories/order";
import "~/spec/factories/transaction";

chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiAsPromised);