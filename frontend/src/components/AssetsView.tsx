/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
    Folder,
    FileText,
    Image as ImageIcon,
    UploadCloud,
    Grid,
    List,
    Trash2,
    Search,
    Eye,
    X
} from 'lucide-react';
import { uploadAsset } from '../services/api';

interface AssetFile {
    id: string;
    name: string;
    type: 'image' | 'document' | 'other';
    size: string;
    updatedAt: string;
    url: string;
    folder: string;
}

interface AssetsViewProps {
    authToken?: string;
}

export default function AssetsView({ authToken }: AssetsViewProps) {
    const [activeFolder, setActiveFolder] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedAssetUrl, setSelectedAssetUrl] = useState<string | null>(null);

    const folders = ['All', 'Backgrounds', 'Reference Art', 'Script Logs', 'Textures'];

    // Seed assets using the provided high-quality image URLs
    const [assets, setAssets] = useState<AssetFile[]>([
        {
            id: 'asset_1',
            name: 'Cyber_Tokyo_Layout.png',
            type: 'image',
            size: '2.4 MB',
            updatedAt: '2h ago',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwgZzoGXSfPWNZrJ2f7CVPJgUhC3aTIuWSUtcLCyoMSCw54xUmjjEVbxfKL6QOZznPWDRU45sCB62Ljcf3bR6dDGqt0zw2XBldyOBSi_w8vPFHcWFVBkkqXJ6c6U6sBhJg37OLFI5q67jljhgrywUJPSXOXY0TpA6dwMiJ5AoaZNxXDW6ZWZvOcayahGKHalAMLE4-21tzkd1QEy9CWOnMaWd5fagHbHqlS6A3WEkl7Xvbw_gM6uSg3orhlgsSdKg7clvLuSn3jU',
            folder: 'Backgrounds'
        },
        {
            id: 'asset_2',
            name: 'Ryu_Main_Pose_V2.psd',
            type: 'image',
            size: '14.8 MB',
            updatedAt: 'yesterday',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLrZ5H6b9D7U07ssAIYfzkVnrMluHwcbH51Nfx4TaDw7xxN2LTpc5SNB88rDXngfa55FuhWESOG38CaZxaRFFPdOITDxhKLgO293LpaJXaj21EffapqkxfDrcRBYh4bhgsGBUpsTIXigzyg-UdCzYW9Dt6weXdWx2IfzXbq6C3BaY1v_vLccT9BnsftI_ZflgCYV5Y7aBs1OBOtHoZDgsF3g-oD9jfHX1gASlsVI0yLsOcNKoczCZsYlGOrFjqLCKbGyWqZi9WUuw',
            folder: 'Reference Art'
        },
        {
            id: 'asset_3',
            name: 'Volume_4_Dialogue_Script.docx',
            type: 'document',
            size: '185 KB',
            updatedAt: '3 days ago',
            url: '#',
            folder: 'Script Logs'
        },
        {
            id: 'asset_4',
            name: 'Traditional_Screentone_Dot.png',
            type: 'image',
            size: '520 KB',
            updatedAt: '1 week ago',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuP5lT-5_wREqApQjP6NudW1DGH3o6rq-zrS2GpsUnt5lKFYwTNMGuKSxlDgS_i_D-PzkL8oC0Oh1Z4MCsOzgsJtox6na7EUb9HbxE0wW4pneenzITo-DyYAwtn0XKcCZyY_iqVQrwjSuHPNFb-ItipyzWB-OOQWfMS6nUbHJG_GspBRDhEzxd_rm9LATfur8Z2GKoirCwasHa4HyQm5VHVgNA3ABJuNNiTEPgWVxJu5ZwuMQG_WXN2obZy692khnMyg-bjZjlq44',
            folder: 'Textures'
        }
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('assetType', 'ILLUSTRATION');
        formData.append('description', `Uploaded from Assets Catalog: ${file.name}`);

        try {
            const response = await uploadAsset(formData, authToken);
            const uploaded = response?.data;

            const newAsset: AssetFile = {
                id: String(uploaded?.id || Date.now()),
                name: uploaded?.fileName || file.name,
                type: file.type.startsWith('image/') ? 'image' : 'document',
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                updatedAt: 'Just now',
                url: uploaded?.fileUrl || (file.type.startsWith('image/') ? URL.createObjectURL(file) : '#'),
                folder: activeFolder === 'All' ? 'Reference Art' : activeFolder
            };

            setAssets([newAsset, ...assets]);
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            e.target.value = '';
        }
    };

    const handleDeleteAsset = (id: string) => {
        setAssets(assets.filter(a => a.id !== id));
    };

    const filteredAssets = assets.filter((asset) => {
        if (activeFolder !== 'All' && asset.folder !== activeFolder) return false;
        if (searchQuery) {
            return asset.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    return (
        <div className="space-y-6 select-none animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Assets Catalog</h2>
                    <p className="text-sm text-on-surface-variant font-medium">
                        Store reference illustrations, script files, and studio screentones.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                        <UploadCloud size={18} />
                        Upload File Asset
                    </button>
                </div>
            </div>

            {/* Filter and layout triggers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/15 pb-4">
                {/* folders row */}
                <div className="flex gap-2 bg-surface-container-low/60 p-1 rounded-xl border border-outline-variant/20 overflow-x-auto">
                    {folders.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFolder(f)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                                activeFolder === f
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/40'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* search & view toggles */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant opacity-60">
              <Search size={14} />
            </span>
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/85 border border-outline-variant/20 rounded-xl pl-9 pr-4 py-1.5 text-xs w-48 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                        />
                    </div>

                    <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/25">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white text-primary' : 'text-on-surface-variant'}`}
                        >
                            <Grid size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white text-primary' : 'text-on-surface-variant'}`}
                        >
                            <List size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Asset Grid or List rendering */}
            {filteredAssets.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-outline-variant/30 bg-white/40 flex flex-col items-center justify-center p-12 text-center text-on-surface-variant/55 min-h-[300px]">
                    <Folder size={32} className="stroke-1 mb-2 text-primary opacity-60" />
                    <h3 className="font-bold text-on-surface text-base">Folder is empty</h3>
                    <p className="text-xs text-on-surface-variant mt-1 max-w-xs">Upload layout templates or brush sheets to keep assets accessible.</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredAssets.map((asset) => (
                        <div
                            key={asset.id}
                            className="group bg-white border border-outline-variant/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col h-44 relative"
                        >
                            {/* Thumbnail banner */}
                            <div className="flex-1 bg-surface-container relative overflow-hidden flex items-center justify-center">
                                {asset.type === 'image' && asset.url !== '#' ? (
                                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FileText size={32} className="text-on-surface-variant/40" />
                                )}

                                {/* Hover preview option */}
                                {asset.type === 'image' && asset.url !== '#' && (
                                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => setSelectedAssetUrl(asset.url)}
                                            className="p-2 rounded-xl bg-white text-primary hover:bg-primary-container transition-colors shadow cursor-pointer border-none"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Details strip */}
                            <div className="p-2.5 bg-white border-t border-outline-variant/10">
                                <h4 className="text-xs font-bold text-on-surface truncate" title={asset.name}>
                                    {asset.name}
                                </h4>
                                <div className="flex justify-between items-center mt-1 text-[9px] text-on-surface-variant font-bold">
                                    <span>{asset.size}</span>
                                    <button
                                        onClick={() => handleDeleteAsset(asset.id)}
                                        className="text-on-surface-variant hover:text-error transition-colors bg-transparent border-none cursor-pointer"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* LIST VIEW */
                <div className="bg-white border border-outline-variant/15 rounded-2xl overflow-hidden divide-y divide-outline-variant/10">
                    {filteredAssets.map((asset) => (
                        <div key={asset.id} className="p-3.5 flex items-center justify-between hover:bg-surface-container-low/35 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                {asset.type === 'image' ? (
                                    <ImageIcon size={16} className="text-primary" />
                                ) : (
                                    <FileText size={16} className="text-secondary" />
                                )}
                                <span className="text-xs font-bold text-on-surface truncate max-w-md">{asset.name}</span>
                            </div>

                            <div className="flex items-center gap-6 shrink-0 text-xs text-on-surface-variant font-bold">
                                <span>{asset.folder}</span>
                                <span>{asset.size}</span>
                                <span>{asset.updatedAt}</span>
                                <button
                                    onClick={() => handleDeleteAsset(asset.id)}
                                    className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-error-container/20 bg-transparent border-none cursor-pointer"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox asset visualizer */}
            {selectedAssetUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedAssetUrl(null)}
                >
                    <div className="relative max-w-3xl max-h-[90vh] bg-[#121314] rounded-2xl overflow-hidden border border-white/15 p-4">
                        <button
                            onClick={() => setSelectedAssetUrl(null)}
                            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-xl transition-colors bg-transparent border-none cursor-pointer z-10"
                        >
                            <X size={20} />
                        </button>
                        <img src={selectedAssetUrl} alt="Asset Fullscreen" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    );
}
