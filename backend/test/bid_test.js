const { expect } = require('chai');
const sinon = require('sinon');
const { placeBid, getBidsForAuction } = require('../controllers/bidController');
const Bid = require('../models/Bid');
const BidOperation = require('../services/templates/BidOperation');

describe('Bid Controller', () => {
  let req, res, sandbox, executeStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { params: { id: '1' }, body: { amount: 100 }, user: { id: 'u1', name: 'User1' } };
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis() };
    });

  afterEach(() => {
    sandbox.restore();
  });

  // Place Bid //
  describe('placeBid', () => {
    let executeStub;
    
    beforeEach(() => {
      executeStub = sandbox.stub(BidOperation.prototype, 'execute');
    });

    it('should return a success when a bid is placed', async () => {
        executeStub.callsFake(async (req, res) => {
            res.json({ success: true, placed: true, amount: req.body.amount, bidder: req.user.id });
        });

      await placeBid(req, res);

        expect(executeStub.calledOnce).to.be.true;
        expect(executeStub.calledWith(req, res)).to.be.true;
        expect(res.json.calledWith({ success: true, 
        placed: true, 
        amount: 100, 
        bidder: 'u1' })).to.be.true;
    });

    it('should return an error when a bid fails', async () => {
        executeStub.callsFake(async (req, res) => {
            res.status(400).json({ success: false, message: 'Bid too low' });
        });

        await placeBid(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ success: false, message: 'Bid too low'  })).to.be.true;
    });
  });

  // Get Bids for Auction //
  describe('getBidsForAuction', () => {
    let findStub, populateStub, sortStub, countStub;

    beforeEach(() => {
      sortStub = sandbox.stub().resolves([
        { 
          _id: 'b1', 
          amount: 200, 
          bidder: { name: 'User1' } 
        },
        { 
          _id: 'b2', 
          amount: 150, 
          bidder: { name: 'User2' } 
        }
      ]);

      populateStub = sandbox.stub();
      populateStub.onCall(0).returns({ sort: sortStub });

      findStub = sandbox.stub(Bid, 'find').returns({ populate: populateStub });
      countStub = sandbox.stub(Bid, 'countDocuments').resolves(2);
    });

    it('should return auction bids in newest-first order', async () => {
      await getBidsForAuction(req, res);

      expect(findStub.calledWith({ auction: '1' })).to.be.true;
      expect(populateStub.calledWith('bidder', 'name')).to.be.true;
      expect(sortStub.calledWith({ bidTime: -1 })).to.be.true;
      expect(countStub.calledWith({ auction: '1' })).to.be.true;

      expect(res.json.calledWith({
        success: true,
        data: [
          { 
            _id: 'b1', 
            amount: 200, 
            bidder: { name: 'User1' } 
          },
          { 
            _id: 'b2', 
            amount: 150, 
            bidder: { name: 'User2' } 
          }
        ]
      })).to.be.true;
    });

    it('should return empty array when no bids exist', async () => {
      sortStub.resolves([]);

      await getBidsForAuction(req, res);

      expect(res.json.calledWith({ 
        success: true, 
        data: [] 
      })).to.be.true;
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database error';
      sortStub.rejects(new Error(errorMessage));

      await getBidsForAuction(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ 
        success: false, 
        error: 'Database error' 
      })).to.be.true;
    });
  });
});