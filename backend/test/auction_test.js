const { expect } = require('chai');
const sinon = require('sinon');
const { getAuctions, getAuctionById } = require('../controllers/auctionController');
const Auction = require('../models/Auction');

describe('Auction Controller', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {};
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getAuctions', () => {
    let findStub, populateStub, sortStub;

    beforeEach(() => {
      sortStub = sandbox.stub().resolves([
        {
          _id: '1',
          title: 'Test Auction 1',
          description: 'Test Description 1',
          seller: { name: 'Seller 1' },
          winner: { name: 'Winner 1' }
        },
        {
          _id: '2', 
          title: 'Test Auction 2',
          description: 'Test Description 2',
          seller: { name: 'Seller 2' },
          winner: null
        }
      ]);

      populateStub = sandbox.stub();
      populateStub.onCall(0).returns({ populate: populateStub });
      populateStub.onCall(1).returns({ sort: sortStub });

      findStub = sandbox.stub(Auction, 'find').returns({ populate: populateStub });
    });

    it('should return all auctions successfully', async () => {
      await getAuctions(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(findStub.calledWith({})).to.be.true;
      expect(populateStub.calledWith('seller', 'name')).to.be.true;
      expect(populateStub.calledWith('winner', 'name')).to.be.true;
      expect(sortStub.calledWith({ endDate: -1 })).to.be.true;
      
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: [
          {
            _id: '1',
            title: 'Test Auction 1',
            description: 'Test Description 1',
            seller: { name: 'Seller 1' },
            winner: { name: 'Winner 1' }
          },
          {
            _id: '2',
            title: 'Test Auction 2', 
            description: 'Test Description 2',
            seller: { name: 'Seller 2' },
            winner: null
          }
        ]
      })).to.be.true;
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database connection failed';
      sortStub.rejects(new Error(errorMessage));

      await getAuctions(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: errorMessage
      })).to.be.true;
    });

    it('should return empty array when no auctions exist', async () => {
      sortStub.resolves([]);

      await getAuctions(req, res);

      expect(res.json.calledWith({
        success: true,
        data: []
      })).to.be.true;
    });
  });

  describe('getAuctionById', () => {
    let findByIdStub, populateStub;

    beforeEach(() => {
      populateStub = sandbox.stub();
      populateStub.onCall(0).returns({ populate: populateStub });
      populateStub.onCall(1).resolves({
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Auction',
        description: 'Test Description',
        startingPrice: 100,
        currentPrice: 150,
        seller: { name: 'John Doe', email: 'john@example.com' },
        winner: { name: 'Jane Smith' }
      });

      findByIdStub = sandbox.stub(Auction, 'findById').returns({ populate: populateStub });
    });

    it('should return auction by ID successfully', async () => {
      req.params = { id: '507f1f77bcf86cd799439011' };
      
      await getAuctionById(req, res);

      expect(findByIdStub.calledWith('507f1f77bcf86cd799439011')).to.be.true;
      expect(populateStub.calledWith('seller', 'name email')).to.be.true;
      expect(populateStub.calledWith('winner', 'name')).to.be.true;
      
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Test Auction',
          description: 'Test Description',
          startingPrice: 100,
          currentPrice: 150,
          seller: { name: 'John Doe', email: 'john@example.com' },
          winner: { name: 'Jane Smith' }
        }
      })).to.be.true;
    });

    it('should return 404 when auction is not found', async () => {
      req.params = { id: 'not-found' };
      populateStub.onCall(1).resolves(null);

      await getAuctionById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: 'Auction not found'
      })).to.be.true;
    });

    it('should handle invalid auction ID', async () => {
      req.params = { id: 'invalid-id' };
      const errorMessage = 'Cast to ObjectId failed';
      populateStub.onCall(1).rejects(new Error(errorMessage));

      await getAuctionById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        error: errorMessage
      })).to.be.true;
    });
  });
});