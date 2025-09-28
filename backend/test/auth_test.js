const { expect } = require('chai');
const sinon = require('sinon');
const { registerUser, loginUser, getProfile, updateUserProfile } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('Auth Controller', () => {
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

  // Register //
  describe('registerUser', () => {
    let findOneStub, createStub, signStub;
    
    beforeEach(() => {
        findOneStub = sandbox.stub(User, 'findOne');
        createStub = sandbox.stub(User, 'create');
        signStub = sandbox.stub(jwt, 'sign').returns('mockToken');
    });

    it('should return error if user already exists', async () => {
      req.body = { name: '636', email: '636@gmail.com', password: '636' };  
      findOneStub.resolves({ id: '1'});

      await registerUser(req, res); 
    
      expect(findOneStub.calledOnce).to.be.true;
      expect(res.status.calledWith(400)).to.be.true; 
      expect(res.json.calledWith({ 
        message: 'User already exists'
      })).to.be.true;
    });

    it('should create new user successfully with token', async () => {
      req.body = { name: '636', email: '636@gmail.com', password: '636' };  
      findOneStub.resolves(null);
      createStub.resolves({ id: '636', name: '636', email: '636@gmail.com' });

      await registerUser(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true; 
      expect(res.json.calledWith({ 
        id: '636', 
        name: '636', 
        email: '636@gmail.com', 
        token: 'mockToken' 
      })).to.be.true;
    });

    it('should handle database errors', async () => {
        const errorMessage = 'Database connection failed';
        req.body = { name: '636', email: '636@gmail.com', password: '636' };  
        findOneStub.rejects(new Error(errorMessage));

        await registerUser(req, res);
        
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ 
            message: errorMessage 
        })).to.be.true;
    });
  });

  // Login //
  describe('loginUser', () => {
    let findOneStub, compareStub, signStub;

    beforeEach(() => {
        findOneStub = sandbox.stub(User, 'findOne');
        compareStub = sandbox.stub(bcrypt, 'compare');
        signStub = sandbox.stub(jwt, 'sign').returns('mockToken');
    });

    it('should return error for invalid email or password', async () => {
        req.body = { email: '636@gmail.com', password: '636' };
        findOneStub.resolves({ id: '636', password: 'hashedPassword' });
        compareStub.resolves(false);   

        await loginUser(req, res);

        expect(res.status.calledWith(200)).to.be.true; 
        expect(res.json.calledWith({ 
            message: 'Invalid email or password' 
        })).to.be.true;
    });

    it('should login successfully and return token', async () => {
      req.body = { email: '636@gmail.com', password: '636' };
      findOneStub.resolves({ id: '636', 
        name: '636', 
        email: '636@gmail.com', 
        password: '636',
        university: 'qut',
        address: 'Herston' 
      });
      compareStub.resolves(true);   

        await loginUser(req, res);

      expect(signStub.calledOnce).to.be.true;
      expect(res.json.calledWith({ 
        id: '636', 
        name: '636', 
            email: '636@gmail.com', 
            token: 'mockToken' 
        })).to.be.true;
    });

    it('should handle database errors', async () => {
        const errorMessage = 'Database connection failed';
        req.body = { name: '636', email: '636@gmail.com', password: '636' };  
        findOneStub.rejects(new Error(errorMessage));

        await loginUser(req, res);
        
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ 
            message: errorMessage 
        })).to.be.true;
    });
  });

  // Profile //
  describe('getProfile', () => {
    let findByIdStub;
    
    beforeEach(() => {
      findByIdStub = sandbox.stub(User, 'findById');
    });

    it('should return 404 if user not found', async () => {
      req.user = { id: '636' };
      findByIdStub.resolves(null);

      await getProfile(req, res);

      expect(findByIdStub.calledWith('636')).to.be.true;
      expect(res.status.calledWith(404)).to.be.true; 
      expect(res.json.calledWith({ 
          message: 'User not found'
      })).to.be.true;
    });

    it('should return profile successfully', async () => {
      req.user = { id: '636' };
      findByIdStub.resolves({ id: '636',
          name: '636', 
          email: '636@gmail.com', 
          university: 'qut', 
          address: 'Herston' 
      });

      await getProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true; 
      expect(res.json.calledWithMatch({ id: '636', 
        name: '636', 
        email: '636@gmail.com', 
        university: 'qut', 
        address: 'Herston' 
      })).to.be.true;
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database connection failed';
      req.user = { id: '636' };
      findByIdStub.withArgs('636').rejects(new Error(errorMessage));

      await getProfile(req, res);
            
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ 
        message: 'Server error', 
        error: errorMessage,
      })).to.be.true;
    });
  });
  
  // Update Profile //
  describe('updateUserProfile', () => {
    let findByIdStub, signStub;

    beforeEach(() => {
      signStub = sandbox.stub(jwt, 'sign').returns('mockToken');
      findByIdStub = sandbox.stub(User, 'findById');
    });

    it('should return 404 if user not found', async () => {
      req.user = { id: '636' };
      findByIdStub.resolves(null);

      await updateUserProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true; 
      expect(res.json.calledWith({ 
        message: 'User not found' 
      })).to.be.true;
    });

    it('should update user profile successfully and return token', async () => {
      req.user = { id: '636' };
      req.body = { name: 'Updated', 
      email: 'test@gmail.com', 
      university: 'New Uni', 
      address: 'New Addr' };
            
      const mockUser = { 
        id: '636', 
        name: '636', 
        email: '636@gmail.com', 
        university: 'qut', 
        address: 'Herston',
      };        
      mockUser.save = sinon.stub().resolves(mockUser);

      findByIdStub.resolves(mockUser);

      await updateUserProfile(req, res);

      expect(mockUser.save.calledOnce).to.be.true;
      expect(res.json.calledWith({ id: '636', 
        name: 'Updated', 
        email: 'test@gmail.com', 
        university: 'New Uni', 
        address: 'New Addr', 
        token: 'mockToken' 
      })).to.be.true;
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database connection failed';
      req.user = { id: '636' };
      findByIdStub.rejects(new Error(errorMessage));

      await updateUserProfile(req, res);
            
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ 
        message: errorMessage 
      })).to.be.true;
    });
  });
}); 