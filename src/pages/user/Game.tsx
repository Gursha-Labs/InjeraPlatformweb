import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import kaboom from 'kaboom'
import { Play, Pause, RotateCcw, Trophy, Gamepad2, Zap, Target, Star, Clock, Users, Award, Crown } from 'lucide-react'

interface GameStats {
    score: number
    highScore: number
    gamesPlayed: number
    totalPoints: number
}

interface GameDefinition {
    id: string
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    category: 'arcade' | 'puzzle' | 'action' | 'strategy'
    icon: React.ReactNode
    color: string
    play: (canvas: HTMLCanvasElement) => Promise<void>
}

// Import Kaboom constants
const { LEFT, UP, DOWN } = kaboom ? kaboom : { LEFT: 'left', UP: 'up', DOWN: 'down' };

export default function Game() {
    const [selectedGame, setSelectedGame] = useState<string>('flappy')
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [gameStats, setGameStats] = useState<GameStats>({
        score: 0,
        highScore: 0,
        gamesPlayed: 0,
        totalPoints: 0,
    })

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const gameInstanceRef = useRef<any>(null)

    // Game definitions
    const games: GameDefinition[] = [
        {
            id: 'flappy',
            title: 'Flappy Bird',
            description: 'Navigate through pipes without hitting them',
            difficulty: 'medium',
            category: 'arcade',
            icon: <Zap className="h-5 w-5" />,
            color: 'from-blue-500 to-cyan-400',
            play: async (canvas) => {
                // Check if canvas is ready
                if (!canvas || !canvas.getContext) {
                    throw new Error('Canvas not ready');
                }

                const k = kaboom({
                    canvas,
                    background: [135, 206, 235],
                    width: 800,
                    height: 600,
                    scale: 1,
                    debug: false,
                })

                // Game variables
                let score = 0
                let isGameOver = false
                const GRAVITY = 980
                const JUMP_FORCE = -320
                const PIPE_SPEED = -200
                const PIPE_GAP = 160
                const PIPE_SPAWN_RATE = 2

                // Load assets
                k.loadSprite("bird", "https://kaboomjs.com/example/sprites/bird.png")
                k.loadSprite("pipe", "https://kaboomjs.com/example/sprites/pipe.png")

                // Bird
                const bird = k.add([
                    k.sprite("bird"),
                    k.pos(80, k.height() / 2),
                    k.area(),
                    k.body(),
                ])

                // Score text
                const scoreText = k.add([
                    k.text(score.toString(), { size: 48 }),
                    k.pos(k.width() / 2, 50),
                    k.color(1, 1, 1),
                    k.fixed(),
                ])

                // Game over text
                const gameOverText = k.add([
                    k.text("Game Over!", { size: 64 }),
                    k.pos(k.width() / 2, k.height() / 2),
                    k.color(1, 0, 0),
                    k.opacity(0),
                    k.fixed(),
                ])

                // Jump on click/space
                k.onKeyPress("space", () => bird.jump(JUMP_FORCE))
                k.onClick(() => bird.jump(JUMP_FORCE))

                // Pipe spawn loop
                k.loop(PIPE_SPAWN_RATE, () => {
                    if (isGameOver) return

                    const pipeHeight = k.rand(100, k.height() - PIPE_GAP - 100)

                    // Bottom pipe
                    k.add([
                        k.sprite("pipe"),
                        k.pos(k.width(), pipeHeight + PIPE_GAP),
                        k.area(),
                        k.move(LEFT, PIPE_SPEED),
                        "pipe",
                        { passed: false },
                    ])

                    // Top pipe
                    k.add([
                        k.sprite("pipe", { flipY: true }),
                        k.pos(k.width(), pipeHeight),
                        k.area(),
                        k.move(LEFT, PIPE_SPEED),
                        "pipe",
                        { passed: false },
                    ])
                })

                // Score when passing pipes
                k.onUpdate("pipe", (p) => {
                    if (p.pos.x < bird.pos.x && !p.passed) {
                        p.passed = true
                        score++
                        scoreText.text = score.toString()

                        // Update game stats
                        setGameStats(prev => ({
                            ...prev,
                            score: score,
                            highScore: Math.max(prev.highScore, score)
                        }))
                    }

                    // Remove pipes when off screen
                    if (p.pos.x < -100) {
                        k.destroy(p)
                    }
                })

                // Collision with pipes or ground
                bird.onCollide("pipe", () => {
                    if (!isGameOver) {
                        isGameOver = true
                        gameOverText.opacity = 1
                        k.wait(2, () => {
                            setGameStats(prev => ({
                                ...prev,
                                gamesPlayed: prev.gamesPlayed + 1,
                                totalPoints: prev.totalPoints + score
                            }))
                            stopGame()
                        })
                    }
                })

                // Game boundaries
                bird.onUpdate(() => {
                    if (bird.pos.y > k.height() || bird.pos.y < 0) {
                        if (!isGameOver) {
                            isGameOver = true
                            gameOverText.opacity = 1
                            k.wait(2, () => {
                                setGameStats(prev => ({
                                    ...prev,
                                    gamesPlayed: prev.gamesPlayed + 1,
                                    totalPoints: prev.totalPoints + score
                                }))
                                stopGame()
                            })
                        }
                    }
                })

                gameInstanceRef.current = k
                return k
            }
        },
        {
            id: 'platformer',
            title: 'Platform Jumper',
            description: 'Jump between platforms to reach higher scores',
            difficulty: 'easy',
            category: 'action',
            icon: <Target className="h-5 w-5" />,
            color: 'from-green-500 to-emerald-400',
            play: async (canvas) => {
                // Check if canvas is ready
                if (!canvas || !canvas.getContext) {
                    throw new Error('Canvas not ready');
                }

                const k = kaboom({
                    canvas,
                    background: [25, 25, 35],
                    width: 800,
                    height: 600,
                    scale: 1,
                })

                // Game variables
                let score = 0
                const PLAYER_SPEED = 200
                const JUMP_FORCE = -400

                // Create player
                const player = k.add([
                    k.rect(30, 30),
                    k.color(0, 255, 255),
                    k.pos(k.width() / 2, k.height() / 2),
                    k.area(),
                    k.body(),
                ])

                // Score display
                const scoreText = k.add([
                    k.text("Score: 0", { size: 32 }),
                    k.pos(20, 20),
                    k.color(1, 1, 1),
                    k.fixed(),
                ])

                // Create initial platforms
                function createPlatform(x: number, y: number, width = 100, height = 20) {
                    return k.add([
                        k.rect(width, height),
                        k.pos(x, y),
                        k.color(100, 100, 200),
                        k.area(),
                        k.body({ isStatic: true }),
                        "platform",
                    ])
                }

                // Create some initial platforms
                createPlatform(k.width() / 2 - 50, k.height() - 50)
                createPlatform(100, 400)
                createPlatform(500, 300)
                createPlatform(200, 200)

                // Platform generation
                k.onUpdate(() => {
                    const platforms = k.get("platform");
                    if (platforms.length < 10 && k.rand() < 0.01) {
                        const x = k.rand(50, k.width() - 150)
                        const y = k.rand(50, k.height() - 100)
                        createPlatform(x, y, k.rand(80, 150), 20)
                    }
                })

                // Player movement
                k.onKeyDown("left", () => player.move(-PLAYER_SPEED, 0))
                k.onKeyDown("right", () => player.move(PLAYER_SPEED, 0))
                k.onKeyPress("space", () => {
                    if (player.isGrounded()) {
                        player.jump(JUMP_FORCE)
                        score += 10
                        scoreText.text = `Score: ${score}`

                        setGameStats(prev => ({
                            ...prev,
                            score: score,
                            highScore: Math.max(prev.highScore, score)
                        }))
                    }
                })

                // Game boundaries
                player.onUpdate(() => {
                    // Keep player in bounds
                    if (player.pos.x < 0) player.pos.x = 0
                    if (player.pos.x > k.width() - 30) player.pos.x = k.width() - 30

                    // Game over if player falls
                    if (player.pos.y > k.height()) {
                        setGameStats(prev => ({
                            ...prev,
                            gamesPlayed: prev.gamesPlayed + 1,
                            totalPoints: prev.totalPoints + score
                        }))
                        stopGame()
                    }
                })

                // Score from jumping between platforms
                let lastPlatformY = player.pos.y
                player.onUpdate(() => {
                    if (player.pos.y < lastPlatformY - 100) {
                        score += 50
                        scoreText.text = `Score: ${score}`
                        lastPlatformY = player.pos.y

                        setGameStats(prev => ({
                            ...prev,
                            score: score,
                            highScore: Math.max(prev.highScore, score)
                        }))
                    }
                })

                gameInstanceRef.current = k
                return k
            }
        },
        {
            id: 'asteroids',
            title: 'Space Asteroids',
            description: 'Destroy asteroids with your spaceship',
            difficulty: 'hard',
            category: 'action',
            icon: <Star className="h-5 w-5" />,
            color: 'from-purple-500 to-pink-400',
            play: async (canvas) => {
                // Check if canvas is ready
                if (!canvas || !canvas.getContext) {
                    throw new Error('Canvas not ready');
                }

                const k = kaboom({
                    canvas,
                    background: [10, 10, 20],
                    width: 800,
                    height: 600,
                })

                let score = 0
                let lives = 3
                const BULLET_SPEED = 400
                const ASTEROID_SPEED = 100
                const PLAYER_SPEED = 300

                // Player spaceship
                const player = k.add([
                    k.triangle(20),
                    k.color(0, 255, 0),
                    k.pos(k.width() / 2, k.height() - 50),
                    k.rotate(0),
                    k.area(),
                    "player",
                ])

                // Score display
                const scoreText = k.add([
                    k.text(`Score: ${score}`, { size: 24 }),
                    k.pos(20, 20),
                    k.color(1, 1, 1),
                    k.fixed(),
                ])

                // Lives display
                const livesText = k.add([
                    k.text(`Lives: ${lives}`, { size: 24 }),
                    k.pos(20, 60),
                    k.color(1, 0, 0),
                    k.fixed(),
                ])

                // Player movement
                k.onKeyDown("left", () => player.move(-PLAYER_SPEED, 0))
                k.onKeyDown("right", () => player.move(PLAYER_SPEED, 0))

                // Shooting
                k.onKeyPress("space", () => {
                    k.add([
                        k.rect(4, 10),
                        k.color(255, 255, 0),
                        k.pos(player.pos),
                        k.area(),
                        k.move(UP, BULLET_SPEED),
                        "bullet",
                        { timeout: 0 },
                    ])
                })

                // Asteroid spawning
                k.loop(1, () => {
                    const x = k.rand(0, k.width())
                    k.add([
                        k.circle(k.rand(10, 30)),
                        k.color(150, 150, 150),
                        k.pos(x, -30),
                        k.area(),
                        k.move(DOWN, ASTEROID_SPEED + k.rand(-50, 50)),
                        "asteroid",
                    ])
                })

                // Bullet-asteroid collision
                k.onCollide("bullet", "asteroid", (b, a) => {
                    k.destroy(b)
                    k.destroy(a)
                    score += 100
                    scoreText.text = `Score: ${score}`

                    setGameStats(prev => ({
                        ...prev,
                        score: score,
                        highScore: Math.max(prev.highScore, score)
                    }))
                })

                // Player-asteroid collision
                k.onCollide("player", "asteroid", (p, a) => {
                    k.destroy(a)
                    lives--
                    livesText.text = `Lives: ${lives}`

                    if (lives <= 0) {
                        setGameStats(prev => ({
                            ...prev,
                            gamesPlayed: prev.gamesPlayed + 1,
                            totalPoints: prev.totalPoints + score
                        }))
                        stopGame()
                    }
                })

                // Clean up bullets
                k.onUpdate("bullet", (b: any) => {
                    b.timeout += k.dt()
                    if (b.timeout > 2 || b.pos.y < 0) {
                        k.destroy(b)
                    }
                })

                // Clean up asteroids
                k.onUpdate("asteroid", (a) => {
                    if (a.pos.y > k.height() + 50) {
                        k.destroy(a)
                    }
                })

                gameInstanceRef.current = k
                return k
            }
        },
        {
            id: 'memory',
            title: 'Memory Match',
            description: 'Find matching pairs of cards',
            difficulty: 'medium',
            category: 'puzzle',
            icon: <Gamepad2 className="h-5 w-5" />,
            color: 'from-amber-500 to-orange-400',
            play: async (canvas) => {
                // Check if canvas is ready
                if (!canvas || !canvas.getContext) {
                    throw new Error('Canvas not ready');
                }

                const k = kaboom({
                    canvas,
                    background: [240, 240, 240],
                    width: 800,
                    height: 600,
                })

                const CARD_WIDTH = 80
                const CARD_HEIGHT = 100
                const GRID_COLS = 6
                const GRID_ROWS = 4
                const TOTAL_CARDS = (GRID_COLS * GRID_ROWS) / 2

                let score = 0
                let moves = 0
                let flippedCards: any[] = []
                let matchedPairs = 0
                let canFlip = true

                // Create symbols for cards
                const symbols = ['♠', '♥', '♦', '♣', '★', '☀', '☁', '❄', '⚡', '❤', '✰', '♫']

                // Shuffle array
                function shuffle(array: string[]) {
                    const shuffled = [...array, ...array]
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
                    }
                    return shuffled
                }

                const cardSymbols = shuffle(symbols.slice(0, TOTAL_CARDS))
                const cards: any[] = []

                // Create cards
                for (let row = 0; row < GRID_ROWS; row++) {
                    for (let col = 0; col < GRID_COLS; col++) {
                        const index = row * GRID_COLS + col
                        const symbol = cardSymbols[index]

                        const card = k.add([
                            k.rect(CARD_WIDTH, CARD_HEIGHT),
                            k.color(200, 200, 255),
                            k.pos(col * (CARD_WIDTH + 10) + 100, row * (CARD_HEIGHT + 10) + 100),
                            k.area(),
                            k.outline(2),
                            "card",
                            {
                                symbol,
                                isFlipped: false,
                                isMatched: false,
                                index,
                            } as any,
                        ])

                        // Card text (hidden when not flipped)
                        const cardText = k.add([
                            k.text(symbol, { size: 32 }),
                            k.pos(card.pos.x + CARD_WIDTH / 2, card.pos.y + CARD_HEIGHT / 2),
                            k.color(0, 0, 0),
                            k.opacity(0),
                            k.fixed(),
                        ])

                            ; (card as any).cardText = cardText
                        cards.push(card)
                    }
                }

                // Score display
                const scoreText = k.add([
                    k.text(`Score: ${score}`, { size: 24 }),
                    k.pos(20, 20),
                    k.color(0, 0, 0),
                    k.fixed(),
                ])

                // Moves display
                const movesText = k.add([
                    k.text(`Moves: ${moves}`, { size: 24 }),
                    k.pos(20, 60),
                    k.color(0, 0, 0),
                    k.fixed(),
                ])

                // Card click handler
                k.onClick("card", (card: any) => {
                    if (!canFlip || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

                    // Flip card
                    card.isFlipped = true
                    card.color = k.Color.fromArray([255, 255, 200])
                    card.cardText.opacity = 1
                    flippedCards.push(card)

                    if (flippedCards.length === 2) {
                        moves++
                        movesText.text = `Moves: ${moves}`
                        canFlip = false

                        const [card1, card2] = flippedCards

                        if (card1.symbol === card2.symbol) {
                            // Match found
                            score += 100
                            scoreText.text = `Score: ${score}`
                            matchedPairs++

                            setGameStats(prev => ({
                                ...prev,
                                score: score,
                                highScore: Math.max(prev.highScore, score)
                            }))

                            card1.isMatched = true
                            card2.isMatched = true
                            card1.color = k.Color.fromArray([100, 255, 100])
                            card2.color = k.Color.fromArray([100, 255, 100])

                            flippedCards = []
                            canFlip = true

                            // Check win condition
                            if (matchedPairs === TOTAL_CARDS) {
                                k.wait(1, () => {
                                    setGameStats(prev => ({
                                        ...prev,
                                        gamesPlayed: prev.gamesPlayed + 1,
                                        totalPoints: prev.totalPoints + score
                                    }))
                                    stopGame()
                                })
                            }
                        } else {
                            // No match
                            k.wait(1, () => {
                                card1.isFlipped = false
                                card2.isFlipped = false
                                card1.color = k.Color.fromArray([200, 200, 255])
                                card2.color = k.Color.fromArray([200, 200, 255])
                                card1.cardText.opacity = 0
                                card2.cardText.opacity = 0
                                flippedCards = []
                                canFlip = true
                            })
                        }
                    }
                })

                gameInstanceRef.current = k
                return k
            }
        }
    ]

    const selectedGameObj = games.find(game => game.id === selectedGame)

    const startGame = async () => {
        if (!canvasRef.current) {
            toast.error("Canvas not available", {
                description: "Please refresh the page and try again."
            })
            return
        }

        setIsLoading(true)

        try {
            // Stop any existing game
            if (gameInstanceRef.current) {
                try {
                    gameInstanceRef.current.destroy()
                    gameInstanceRef.current = null
                } catch (e) {
                    console.log('Cleaning up previous game')
                }
            }

            // Ensure canvas is ready
            const canvas = canvasRef.current
            if (!canvas.getContext) {
                throw new Error('Canvas context not available')
            }

            // Clear canvas
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }

            // Start new game
            if (selectedGameObj) {
                // Wait a bit to ensure DOM is ready
                await new Promise(resolve => setTimeout(resolve, 100))

                await selectedGameObj.play(canvas)
                setIsPlaying(true)
                toast.success("Game started!", {
                    description: `Playing ${selectedGameObj.title}. Good luck!`
                })
            }
        } catch (error) {
            console.error('Error starting game:', error)
            setIsPlaying(false)
            toast.error("Failed to start game", {
                description: error instanceof Error ? error.message : "Please try again or select another game"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const stopGame = () => {
        if (gameInstanceRef.current) {
            try {
                gameInstanceRef.current.destroy()
                gameInstanceRef.current = null
            } catch (e) {
                console.log('Error stopping game:', e)
            }
        }
        setIsPlaying(false)
        toast.info("Game ended", {
            description: `Final score: ${gameStats.score}`
        })
    }

    const resetGame = () => {
        stopGame()
        setGameStats(prev => ({
            ...prev,
            score: 0
        }))
        // Wait a bit before starting new game
        setTimeout(() => {
            startGame()
        }, 100)
    }

    const handleGameSelect = (gameId: string) => {
        setSelectedGame(gameId)
        stopGame()
        setGameStats(prev => ({ ...prev, score: 0 }))
        toast.info("Game selected", {
            description: `Ready to play ${games.find(g => g.id === gameId)?.title}`
        })
    }

    // Initialize canvas on mount
    useEffect(() => {
        if (canvasRef.current) {
            // Set canvas dimensions
            const canvas = canvasRef.current
            canvas.width = 800
            canvas.height = 600

            // Clear canvas
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = '#000000'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
        }

        return () => {
            if (gameInstanceRef.current) {
                try {
                    gameInstanceRef.current.destroy()
                } catch (e) {
                    console.log('Error cleaning up game:', e)
                }
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Game Arena
                        </h1>
                        <p className="text-muted-foreground mt-2">Play exciting games and earn rewards!</p>
                    </div>

                    {/* Stats Card */}
                    <Card className="bg-card border-border backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-muted-foreground">High Score</span>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{gameStats.highScore}</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Clock className="h-4 w-4 text-secondary" />
                                        <span className="text-sm font-medium text-muted-foreground">Games Played</span>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{gameStats.gamesPlayed}</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-muted-foreground">Total Points</span>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{gameStats.totalPoints}</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Crown className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-medium text-muted-foreground">Current Score</span>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{gameStats.score}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8 bg-border" />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Game Selection */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <Gamepad2 className="h-5 w-5" />
                                    Select a Game
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Choose from our collection of games
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {games.map((game) => (
                                    <div
                                        key={game.id}
                                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] ${selectedGame === game.id
                                            ? 'bg-accent border border-primary/30'
                                            : 'bg-muted/50 hover:bg-muted'
                                            }`}
                                        onClick={() => handleGameSelect(game.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${game.color}`}>
                                                {game.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-foreground">{game.title}</h3>
                                                    <Badge variant={
                                                        game.difficulty === 'easy' ? 'default' :
                                                            game.difficulty === 'medium' ? 'secondary' : 'destructive'
                                                    }>
                                                        {game.difficulty}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{game.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {game.category}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        Kaboom.js
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Instructions */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">How to Play</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-primary">Controls:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Spacebar: Jump/Shoot</li>
                                        <li>• Arrow Keys: Move</li>
                                        <li>• Click/Tap: Interact</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-primary">Tips:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Score points to earn rewards</li>
                                        <li>• Beat your high score</li>
                                        <li>• Try different game modes</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Game Display */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Game Canvas Area */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-foreground">{selectedGameObj?.title}</CardTitle>
                                        <CardDescription className="text-muted-foreground">
                                            {selectedGameObj?.description}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>Online</span>
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Game Canvas */}
                                <div className="relative bg-black rounded-lg overflow-hidden border border-border">
                                    <canvas
                                        ref={canvasRef}
                                        className="w-full h-[500px] bg-black"
                                        width={800}
                                        height={600}
                                    />

                                    {!isPlaying && (
                                        <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-8">
                                            <div className="text-center space-y-4">
                                                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary to-secondary">
                                                    <Gamepad2 className="h-12 w-12 text-primary-foreground" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-foreground">Ready to Play?</h3>
                                                <p className="text-muted-foreground max-w-md">
                                                    Select a game from the left and click Start Game to begin your adventure!
                                                </p>
                                                <Button
                                                    size="lg"
                                                    onClick={startGame}
                                                    disabled={isLoading}
                                                    className="mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                                                            Loading Game...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="h-4 w-4 mr-2" />
                                                            Start Game
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {isPlaying && (
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="text-sm text-muted-foreground">Score</div>
                                                        <div className="text-xl font-bold text-foreground">{gameStats.score}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm text-muted-foreground">High Score</div>
                                                        <div className="text-xl font-bold text-foreground">{gameStats.highScore}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={resetGame}
                                                    >
                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                        Restart
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={stopGame}
                                                    >
                                                        <Pause className="h-4 w-4 mr-2" />
                                                        End Game
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar for Games Played */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-foreground">Game Progress</span>
                                        <span className="text-sm text-muted-foreground">{gameStats.gamesPlayed} games played</span>
                                    </div>
                                    <Progress
                                        value={(gameStats.gamesPlayed % 10) * 10}
                                        className="h-2 bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Complete 10 games to unlock special rewards!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rewards Section */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <Award className="h-5 w-5" />
                                    Earn Rewards
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Play games to earn points and rewards
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-primary/20">
                                                <Trophy className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">Score Points</h4>
                                                <p className="text-sm text-muted-foreground">Earn 1 point per 100 score</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-secondary/20">
                                                <Star className="h-5 w-5 text-secondary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">Daily Bonus</h4>
                                                <p className="text-sm text-muted-foreground">Play daily for extra rewards</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-purple-500/20">
                                                <Crown className="h-5 w-5 text-purple-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">High Scores</h4>
                                                <p className="text-sm text-muted-foreground">Top players get special badges</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}