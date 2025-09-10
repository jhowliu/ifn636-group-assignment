import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import auctionService from "../services/auctionService";
import bidService from "../services/bidService";
import { useAuth } from "../context/AuthContext";

export default function AuctionDetail({ auction: propAuction }) {
    const Ref = useRef(null);
    const { id } = useParams();
    const [auction, setAuction] = useState(propAuction||{})
    const [timer, setTimer] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const { user } = useAuth();

    const startTimer = (e) => {
        setTimer(getTimeRemaining());
    }

    const clearTimer = (e) => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    useEffect(() => {
        clearTimer()
    })

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await auctionService.getAuctionById(id);
                if (response.success) {
                    setAuction(response.data);
                }
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to fetch auction');
            } finally {
                setLoading(false);
            }
        };

        if (!propAuction && id) {
            fetchAuction();
        }
    }, [id, propAuction]);


    const getAuctionStatus = (auction) => {
        if (!auction || !auction.startDate || !auction.endDate) return 'Unknown';
        
        const now = new Date();
        const startDate = new Date(auction.startDate);
        const endDate = new Date(auction.endDate);
        
        if (now < startDate) return 'Upcoming';
        if (now > endDate) return 'Ended';
        return 'Active';
    };

    const getTimeRemaining = () => {
        if (!auction || !auction.endDate) return '';
        
        const now = new Date();
        const endDate = new Date(auction.endDate);
        const diff = endDate - now;

        if (diff <= 0) return '';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) return `${days} days, ${hours}h ${minutes}m ${seconds}s`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please log in to place a bid');
            return;
        }
        
        const amount = parseFloat(bidAmount);
        if (!amount || amount <= auction.currentPrice) {
            alert(`Bid must be higher than current price of $${auction.currentPrice}`);
            return;
        }

        try {
            const response = await bidService.placeBid(id, amount);
            
            if (response.success) {
                alert('Bid placed successfully!');
                setBidAmount('');
                
                // Refresh auction data
                const updatedAuction = await auctionService.getAuctionById(id);
                if (updatedAuction.success) {
                    setAuction(updatedAuction.data);
                }
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to place bid');
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center py-16">
                            <div className="text-red-600 mb-4">
                                <h3 className="text-lg font-medium">Error Loading Auction</h3>
                                <p className="text-sm mt-2">{error}</p>
                            </div>
                            <Link
                                to="/auctions"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Auctions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const status = getAuctionStatus(auction);

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-12 py-12 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left column - Product info */}
                    <div className="space-y-4">
                        {/* Title */}
                        <h1 className="text-4xl font-normal text-gray-900 leading-tight">
                            {auction.title}
                        </h1>

                        {/* Price */}
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-light text-blue-500">
                                ${auction.currentPrice || auction.startingPrice}
                            </span>
                            <span className="font-light text-sm text-red-500">
                                {auction.totalBids > 0 && ( <>({auction.totalBids} bids)</>)}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="text-gray-600 leading-relaxed break-words">
                            {auction.description}
                        </div>

                        {/* Time remaining section */}
                        {status === 'Active' && (
                            <div>
                                <div className="text-lg font-mono font-bold text-orange-600">{timer}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Ends {new Date(auction.endDate).toLocaleString("en-AU", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </div>
                            </div>
                        )}

                          {/* Time remaining section */}
                        {status === 'Upcoming' && (
                            <div>
                                <div className="text-lg font-mono font-bold text-orange-600">{timer}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Starts {new Date(auction.endDate).toLocaleString("en-AU", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Bid options */}
                        {status === 'Active' && (
                            !user ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800">Please log in to place a bid</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                                        <span>Place bid immediately</span>
                                        <button 
                                            type="button"
                                            className="text-gray-400 hover:text-gray-600"
                                            title="Enter a custom bid amount"
                                        >
                                        </button>
                                    </div>

                                    {/* bid input */}
                                    <form onSubmit={handlePlaceBid} className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                min={auction.currentPrice + 0.01}
                                                step="0.01"
                                                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
                                        >
                                            Place Bid
                                        </button>
                                    </form>
                                </div>
                            )
                        )}
                    </div>

                    {/* Right column - Image */}
                    <div className="flex justify-center items-start">
                        {auction.images && auction.images.length > 0 ? (
                            <img
                                alt={auction.title}
                                src={auction.images[0]}
                                className="w-full max-w-md h-auto object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full max-w-md h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                                <span className="text-gray-500 text-sm">No image available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}