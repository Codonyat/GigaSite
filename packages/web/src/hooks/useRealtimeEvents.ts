import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import type { WebSocketTransaction, WebSocketLotteryWon, WebSocketBidPlaced } from "@gigasite/shared";
import { SERVER_URL } from "../config/contract";

export function useRealtimeEvents() {
  const socketRef = useRef<Socket | null>(null);
  const [transactions, setTransactions] = useState<WebSocketTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const onLotteryWon = useRef<((data: WebSocketLotteryWon) => void) | null>(null);
  const onBidPlaced = useRef<((data: WebSocketBidPlaced) => void) | null>(null);

  useEffect(() => {
    const socket = io(SERVER_URL || window.location.origin, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("recentTransactions", (txs: WebSocketTransaction[]) => {
      setTransactions(txs);
    });

    socket.on("newTransaction", (tx: WebSocketTransaction) => {
      setTransactions((prev) => [tx, ...prev].slice(0, 50));
    });

    socket.on("lotteryWon", (data: WebSocketLotteryWon) => {
      onLotteryWon.current?.(data);
    });

    socket.on("bidPlaced", (data: WebSocketBidPlaced) => {
      onBidPlaced.current?.(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribeLotteryWon = useCallback((cb: (data: WebSocketLotteryWon) => void) => {
    onLotteryWon.current = cb;
    return () => { onLotteryWon.current = null; };
  }, []);

  const subscribeBidPlaced = useCallback((cb: (data: WebSocketBidPlaced) => void) => {
    onBidPlaced.current = cb;
    return () => { onBidPlaced.current = null; };
  }, []);

  return { transactions, isConnected, subscribeLotteryWon, subscribeBidPlaced };
}
