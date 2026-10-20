import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  CartesianGrid, Legend
} from 'recharts';
import {
  Bell, Settings, LogOut, Sun, Moon, Search, Download, Upload, Trash2,
  Edit2, Menu, X, Check, Eye, Save, Plus, ArrowUpRight, ArrowDownRight, Printer, AlertTriangle, Send
} from 'lucide-react';
import Papa from 'papaparse';
import ScreenRecorder from './components/ScreenRecorder';
import SignalCard from './components/SignalCard';
import { mockSignal } from './lib/mock-signal';
import './App.css';
