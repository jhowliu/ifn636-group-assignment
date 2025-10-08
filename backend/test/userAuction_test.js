const { expect } = require("chai");
const sinon = require("sinon");
const { createAuction, getUserAuctions, updateAuction, deleteAuction } = require("../controllers/userAuctionController");
const Auction = require("../models/Auction");
const CreateAuctionOperation = require("../services/templates/createAuctionOperation");
const UpdateAuctionOperation = require("../services/templates/updateAuctionOperation");
const DeleteAuctionOperation = require("../services/templates/deleteAuctionOperation");

describe("User Auction Controller", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
        user: { id: "test" },
        body: {}
    };
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Create Auction //
  describe("createAuction", () => {
    let executeStub;

    beforeEach(() => {
      executeStub = sandbox.stub(CreateAuctionOperation.prototype, "execute");
    });

    it("should create an auction successfully", async () => {
        executeStub.callsFake(async (req, res) => {
        res.json({
          success: true,
          data: { id: "newAuctionId" } });
      });

      await createAuction(req, res);

      expect(executeStub.calledOnce).to.be.true;
      expect(executeStub.calledWith(req, res)).to.be.true;


      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: { id: "newAuctionId" }
      })).to.be.true;
    });

    it("should handle database errors", async () => {
      const errorMessage = "Creation Error";
      executeStub.callsFake(async (req, res) => {
        res.status(500).json({ success: false, error: errorMessage });
      });

      await createAuction(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: errorMessage
      })).to.be.true;
    });
  });
  
  // Get User Auctions //
  describe("getUserAuctions", () => {
    let findStub, populateStub, sortStub;

    beforeEach(() => {
      sortStub = sandbox.stub().resolves([
        {
          _id: "1",
          title: "User Auction 1",
          description: "User Description 1",
          seller: { name: "Seller 1" }
        },
        {
          _id: "2",
          title: "User Auction 2",
          description: "User Description 2",
          seller: { name: "Seller 2" }
        }
      ]);
      populateStub = sandbox.stub().returns({ sort: sortStub });
      findStub = sandbox.stub(Auction, "find").returns({ populate: populateStub });
    });

    it("should return user auctions successfully", async () => {
      await getUserAuctions(req, res);

      expect(findStub.calledWith({ seller: req.user.id })).to.be.true;
      expect(populateStub.calledWith("seller", "name")).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: [
          {
            _id: "1",
            title: "User Auction 1",
            description: "User Description 1",
            seller: { name: "Seller 1" }
          },
          {
            _id: "2",
            title: "User Auction 2",
            description: "User Description 2",
            seller: { name: "Seller 2" }
          }
        ]
      })).to.be.true;
    });

    it("should handle database errors", async () => {
      const errorMessage = "Database connection failed";
      sortStub.rejects(new Error(errorMessage));

      await getUserAuctions(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: errorMessage
      })).to.be.true;
    });
  });

  // Update Auction //
  describe("updateAuction", () => {
    let executeStub;

    beforeEach(() => { 
        executeStub = sandbox.stub(UpdateAuctionOperation.prototype, "execute");
    });

    it("should update an auction successfully", async () => {
        executeStub.callsFake(async (req, res) => {
        res.json({
          success: true,
          data: { id: "updatedAuctionId" } });
      });

      await updateAuction(req, res);

      expect(executeStub.calledOnce).to.be.true;
      expect(executeStub.calledWith(req, res)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: { id: "updatedAuctionId" }
      })).to.be.true;
    });

    it("should handle database errors", async () => {
      const errorMessage = "Update Error";
      executeStub.callsFake(async (req, res) => {
        res.status(500).json({ success: false, error: errorMessage });
      });

      await updateAuction(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ 
        success: false,
        error: errorMessage 
      })).to.be.true;
    });
  });

  // Delete Auction //
  describe("deleteAuction", () => {
    let executeStub;

    beforeEach(() => {
      executeStub = sandbox.stub(DeleteAuctionOperation.prototype, "execute");
    });

    it("should delete an auction successfully", async () => {
      executeStub.callsFake(async (req, res) => {
        res.json({
          success: true,
          data: { id: "deletedAuctionId" } });
      });

      await deleteAuction(req, res);

      expect(executeStub.calledOnce).to.be.true;
      expect(executeStub.calledWith(req, res)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: { id: "deletedAuctionId" }
      })).to.be.true;
    });

    it("should handle database errors", async () => {
      const errorMessage = "Deletion Error";
      executeStub.callsFake(async (req, res) => {
        res.status(500).json({ success: false, error: errorMessage });
      });

      await deleteAuction(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: errorMessage
      })).to.be.true;
    });
  });
});

