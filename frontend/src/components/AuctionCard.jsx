import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

export default function AuctionCard({ auction, currentUser }) {
    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);
    const [timer, setTimer] = useState("");

    const getTimeRemaining = () => {
        if (!auction) return '';
        
        const now = new Date();
        const endDate = new Date(auction.endDate);
        const diff = endDate - now;

        if (diff <= 0) return 'ENDED';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

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

    return (
        <div key={auction._id} className="group relative">
            <img
                alt={auction.images.length && auction.images[0]}
                src={auction.images.length && auction.images[0]}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div className="mt-4">
                <div>
                    <h3 className="text-sm text-gray-700 mb-1">
                    <Link to={`/auctions/${auction._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {auction.title}
                    </Link>
                    </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">${auction.currentPrice}</p>
                <p className="text-sm font-medium text-red-600 mt-1">{timer}</p>
                {auction.status === 'ended' && auction.winner && (
                    <p className="text-sm font-medium text-green-600 mt-1">
                        Winner: {auction.winner.name || 'Winner declared'}
                    </p>
                )}
                {auction.status === 'ended' && !auction.winner && (
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        No winner - No bids received
                    </p>
                )}
            </div>
        </div>
    )
}