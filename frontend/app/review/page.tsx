'use client' // chạy ở browser dùng hook React

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, FileText, Calendar, Award, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExtractedItem { // frame xác định hình dạng của 1 object
    id: string;
    type: 'assignment' | 'exam' | 'reading';
    title: string;
    dueDate: string;
    weight?: string;
    description?: string;
    confidence: number;
}


export default function ReviewPage() {

    // Mock data
    const [items, setItems] = useState<ExtractedItem[]>([
        {
            id: '1',
            type: 'assignment',
            title: 'Project Proposal',
            dueDate: '2025-11-22',
            weight: '15%',
            description: 'Submit initial project proposal',
            confidence: 0.95,
        },
        {
            id: '2',
            type: 'exam',
            title: 'Midterm Exam',
            dueDate: '2025-12-05',
            weight: '80%',
            description: 'Covers chapters 1-5',
            confidence: 0.88,
        },
        {
            id: '3',
            type: 'reading',
            title: 'Chapter 3: Data Structures',
            dueDate: '2025-11-15',
            description: 'Required reading',
            confidence: 0.72,
        },
    ]);
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [newItem, setNewItem] = useState({
        type: 'assignment' as 'assignment' | 'exam' | 'reading',
        title: '',
        dueDate: '',
        weight: '',
        description: '',
    });

    const updateItem = (id: string, field: string, value: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const addItem = () => {
        if (!newItem.title || !newItem.dueDate) {
            alert('Please fill in title and due date');
            return;
        }
        const item: ExtractedItem = {
            id: Date.now().toString(),
            type: newItem.type,
            title: newItem.title,
            dueDate: newItem.dueDate,
            weight: newItem.weight || undefined,
            description: newItem.description || undefined,
            confidence: 1.0,
        };

        setItems(prev => [...prev, item]);
        setNewItem({
            type: 'assignment',
            title: '',
            dueDate: '',
            weight: '',
            description: '',
        });
        setIsAddDialogOpen(false);
    };


    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'assignment':
                return <FileText className="h-5 w-5" />;
            case 'exam':
                return <Award className="h-5 w-5" />;
            case 'reading':
                return <Calendar className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'assignment':
                return 'bg-blue-100 text-blue-700';
            case 'exam':
                return 'bg-red-100 text-red-700';
            case 'reading':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-slate-900">Review Extracted Items</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            AI extracted {items.length} items from your materials. Review and edit before generating your study plan.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="relative">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="capitalize">
                                                        {item.type}
                                                    </Badge>
                                                    {item.confidence < 0.8 && (
                                                        <Badge variant="secondary" className="gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Low confidence
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {item.confidence >= 0.8 && (
                                            <Check className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`due-${item.id}`}>Due Date</Label>
                                            <Input
                                                id={`due-${item.id}`}
                                                type="date"
                                                value={item.dueDate}
                                                onChange={(e) => updateItem(item.id, 'dueDate', e.target.value)}
                                            />
                                        </div>
                                        {item.weight && (
                                            <div className="space-y-2">
                                                <Label htmlFor={`weight-${item.id}`}>Weight</Label>
                                                <Input
                                                    id={`weight-${item.id}`}
                                                    value={item.weight}
                                                    onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="space-y-2">
                                            <Label htmlFor={`desc-${item.id}`}>Description</Label>
                                            <Input
                                                id={`desc-${item.id}`}
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <Button variant="outline" size="sm">
                                        View Source
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-6">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Item Manually
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add New Item</DialogTitle>
                                    <DialogDescription>
                                        Manually add an assignment, exam, or reading to your study plan.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value as 'assignment' | 'exam' | 'reading' })}>
                                            <SelectTrigger id="type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="assignment">Assignment</SelectItem>
                                                <SelectItem value="exam">Exam</SelectItem>
                                                <SelectItem value="reading">Reading</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Project Proposal"
                                            value={newItem.title}
                                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dueDate">Due Date</Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={newItem.dueDate}
                                            onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (optional)</Label>
                                        <Input
                                            id="weight"
                                            placeholder="e.g., 15%"
                                            value={newItem.weight}
                                            onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (optional)</Label>
                                        <Input
                                            id="description"
                                            placeholder="Add any details..."
                                            value={newItem.description}
                                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        />
                                    </div>
                                    <Button onClick={addItem} className="w-full">
                                        Add Item
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <div className="flex gap-3">
                            <Button size="lg">Generate Study Plan</Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}