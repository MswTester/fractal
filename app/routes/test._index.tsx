import { current } from "@reduxjs/toolkit";
import { MetaFunction } from "@remix-run/node";
import { useRef, useState } from "react";
import { checkName, checkPassword, sha256 } from "~/utils/auth";
import { useOnce } from "~/utils/hooks";

export const meta: MetaFunction = () => {
    return [
        { title: "Test Page" },
        { name: "description", content: "Test Page" },
    ];
};

export default function Engine() {
    const [user, setUser] = useState<IUser|null>(null)
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const Login = async () => {
        if(!checkName(username)) return setError('Invalid Username')
        if(!checkPassword(password)) return setError('Invalid Password')
        setIsFetching(true)
        const res = await fetch('/controller/col/users/type/get', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username, password:sha256(password)})
        })
        const json:IUser = await res.json()
        setIsFetching(false)
        if(json.id){
            setUser(json)
        } else {
            setError('Invalid Username or Password')
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            {user?.admin ? <Astar user={user} />:
            <div className="flex flex-col justify-center items-center gap-3 w-48">
                <input disabled={isFetching} className="p-2 w-full" type="text" name="" id="" placeholder="Username" value={username} onChange={e => {setUsername(e.target.value);setError('');}}/>
                <input disabled={isFetching} className="p-2 w-full" type="password" name="" id="" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value);setError('');}}/>
                <button disabled={isFetching} className="p-2 w-full" onClick={Login}>Login</button>
                <div className="w-full text-center text-red-500">{error}</div>
            </div>
            }
        </div>
    );
}

function Astar(props: { user: IUser }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useOnce(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                type Point = { x: number; y: number };
                type Line = { start: Point; end: Point };

                const dist = (point: Point, lineStart: Point, lineEnd: Point): number => {
                    const l2 = (lineEnd.x - lineStart.x) ** 2 + (lineEnd.y - lineStart.y) ** 2;
                    if (l2 === 0) return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2); // 시작과 끝이 같은 점일 경우
                    const t = ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / l2;
                    const tClamped = Math.max(0, Math.min(1, t));
                    const closestPoint = {
                        x: lineStart.x + tClamped * (lineEnd.x - lineStart.x),
                        y: lineStart.y + tClamped * (lineEnd.y - lineStart.y),
                    };
                    return Math.sqrt((point.x - closestPoint.x) ** 2 + (point.y - closestPoint.y) ** 2);
                };

                const doSegmentsIntersect = (
                    line1: Line,
                    line2: Line,
                ): boolean => {
                    const orientation = (p: Point, q: Point, r: Point): number => {
                        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
                        if (val === 0) return 0; // collinear
                        return (val > 0) ? 1 : 2; // clock or counterclock wise
                    };
                
                    const onSegment = (p: Point, q: Point, r: Point): boolean => {
                        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
                               q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
                    };
                
                    const o1 = orientation(line1.start, line1.end, line2.start);
                    const o2 = orientation(line1.start, line1.end, line2.end);
                    const o3 = orientation(line2.start, line2.end, line1.start);
                    const o4 = orientation(line2.start, line2.end, line1.end);
                
                    // 일반적인 경우
                    if (o1 !== o2 && o3 !== o4) return true;
                
                    // 특별한 경우
                    if (o1 === 0 && onSegment(line1.start, line2.start, line1.end)) return true; // line2.start가 선분 line1 위에 있음
                    if (o2 === 0 && onSegment(line1.start, line2.end, line1.end)) return true; // line2.end가 선분 line1 위에 있음
                    if (o3 === 0 && onSegment(line2.start, line1.start, line2.end)) return true; // line1.start가 선분 line2 위에 있음
                    if (o4 === 0 && onSegment(line2.start, line1.end, line2.end)) return true; // line1.end가 선분 line2 위에 있음
                
                    return false; // 선분이 겹치지 않음
                };
                
                const target = { x: 20, y: 20 };
                const R = 10;
                const destination = { x: 600, y: 600 };

                const obstacles = [
                    { x: 100, y: 100, width: 100, height: 100 },
                    { x: 300, y: 400, width: 100, height: 100 },
                    { x: 350, y: 150, width: 100, height: 100 },
                    { x: 600, y: 300, width: 100, height: 100 },
                ];

                const isCollision = (line:Line):boolean => {
                    for (let i = 0; i < obstacles.length; i++) {
                        const obstacle = obstacles[i];
                        const lines = [
                            { start: { x: obstacle.x, y: obstacle.y }, end: { x: obstacle.x + obstacle.width, y: obstacle.y } },
                            { start: { x: obstacle.x + obstacle.width, y: obstacle.y }, end: { x: obstacle.x + obstacle.width, y: obstacle.y + obstacle.height } },
                            { start: { x: obstacle.x + obstacle.width, y: obstacle.y + obstacle.height }, end: { x: obstacle.x, y: obstacle.y + obstacle.height } },
                            { start: { x: obstacle.x, y: obstacle.y + obstacle.height }, end: { x: obstacle.x, y: obstacle.y } },
                        ];
                        for (let j = 0; j < lines.length; j++) {
                            if (doSegmentsIntersect(line, lines[j])) return true;
                        }
                    }
                    const filtered = nodes.filter(node => {
                        return node.x !== line.start.x && node.y !== line.start.y && node.x !== line.end.x && node.y !== line.end.y
                        && node.x > Math.min(line.start.x, line.end.x) && node.x < Math.max(line.start.x, line.end.x)
                    });
                    for (let i = 0; i < filtered.length; i++) {
                        if (dist(filtered[i], line.start, line.end) < R) return true;
                    }
                    return false;
                }

                let path: Point[] = [];
                let nodes: Point[] = [];

                // dynamic A* pathfinding
                const findPath = () => {
                    createNodes();
                    path = [];
                    const result = findShortestPathAStar(target, destination);
                    if (result) {
                        path = result.path.slice(1);
                    }
                };

                type PointDist = {
                    point: Point,
                    distance: number,
                    path: Point[]
                }

                type Node = {
                    point: Point,
                    distance: number,
                    path: Point[]
                }
                
                function findShortestPathAStar(start: Point, dest: Point): PointDist | null {
                    const openSet: Node[] = [{ point: start, distance: 0, path: [start] }];
                    const visited: Set<string> = new Set();
                
                    while (openSet.length > 0) {
                        // 현재까지의 최소 거리 노드를 선택
                        openSet.sort((a, b) => a.distance - b.distance);  // 우선순위 큐 대체 (최적화 여지)
                        const { point: current, distance, path } = openSet.shift()!;
                        if (visited.has(`${current.x},${current.y}`)) continue;
                        visited.add(`${current.x},${current.y}`);
                
                        // 목적지에 도달 시 결과 반환
                        if (!isCollision({ start: current, end: dest })) {
                            return { point: dest, distance: distance + getDistance(current, dest), path: [...path, dest] };
                        }
                
                        // 인접 노드를 탐색하여 우선순위 큐에 추가
                        for (const neighbor of getFilteredNodes(current)) {
                            if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
                                openSet.push({
                                    point: neighbor,
                                    distance: distance + getDistance(current, neighbor) + getDistance(neighbor, dest), // g + h
                                    path: [...path, neighbor]
                                });
                            }
                        }
                    }
                    return null;
                }                

                function getDistance(p1:Point, p2:Point):number{
                    return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
                }

                function getFilteredNodes(p:Point):Point[]{
                    return nodes.filter(node => !isCollision({start:p, end:node}))
                }

                const createNodes = () => {
                    nodes = [];
                    const _R = R * Math.sqrt(2)/2 + 1;
                    obstacles.forEach((obstacle) => {
                        nodes.push(
                            { x: obstacle.x - _R, y: obstacle.y - _R },
                            { x: obstacle.x + obstacle.width + _R, y: obstacle.y - _R },
                            { x: obstacle.x + obstacle.width + _R, y: obstacle.y + obstacle.height + _R },
                            { x: obstacle.x - _R, y: obstacle.y + obstacle.height + _R },
                        );
                    });
                }

                let effects:{
                    p:Point; // position
                    c:string; // color
                    t:number; // start time
                    d:number; // duration
                }[] = [];

                const render = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw target (red circle)
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(target.x, target.y, R, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw destination (blue circle)
                    ctx.fillStyle = 'blue';
                    ctx.beginPath();
                    ctx.arc(destination.x, destination.y, 10, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw obstacles (gray rectangles)
                    obstacles.forEach((obstacle) => {
                        ctx.fillStyle = 'gray';
                        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                    });

                    // Draw path (green line)
                    ctx.lineWidth = 2;
                    if (path.length) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'aqua';
                        ctx.moveTo(target.x, target.y);
                        path.forEach((p) => {
                            ctx.lineTo(p.x, p.y);
                        });
                        ctx.stroke();
                    }

                    // Draw nodes (yellow circles)
                    nodes.forEach((node) => {
                        ctx.fillStyle = 'yellow';
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, R, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    // Draw effects
                    effects = effects.filter(effect => {
                        return Date.now() - effect.t < effect.d;
                    });
                    effects.forEach(effect => {
                        ctx.fillStyle = effect.c;
                        ctx.globalAlpha = 1 - (Date.now() - effect.t) / effect.d;
                        ctx.beginPath();
                        ctx.arc(effect.p.x, effect.p.y, 5, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    // Move AI
                    if (path.length) {
                        const next = path[0];
                        const dx = next.x - target.x;
                        const dy = next.y - target.y;
                        const angle = Math.atan2(dy, dx);
                        const speed = 2;
                        target.x += Math.cos(angle) * speed;
                        target.y += Math.sin(angle) * speed;
                        findPath();
                    }

                    requestAnimationFrame(render); // Loop the rendering
                };

                const flashPoints = (ps:Point[], color:string, ms:number) => {
                    ps.forEach(p => {
                        effects.push({p, c:color, t:Date.now(), d:ms});
                    });
                }

                render();

                // Update the destination on canvas click
                canvas.addEventListener('mousedown', (e) => {
                    destination.x = e.offsetX;
                    destination.y = e.offsetY;
                    findPath();
                    if(e.button === 1){
                    } else if(e.button === 2){
                        obstacles.push({x:e.offsetX, y:e.offsetY, width:1, height:1});
                    }
                });
                canvas.addEventListener('mousemove', (e) => {
                    if (e.buttons === 1) {
                        destination.x = e.offsetX;
                        destination.y = e.offsetY;
                    } else if (e.buttons === 2) {
                        const obstacle = obstacles[obstacles.length - 1];
                        obstacle.width = e.offsetX - obstacle.x;
                        obstacle.height = e.offsetY - obstacle.y;
                    }
                });
                canvas.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });

                // Handle canvas resize
                const resize = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };
                window.addEventListener('resize', resize);
                resize();
                return () => {
                    window.removeEventListener('resize', resize);
                };
            }
        }
    });
    return <canvas ref={canvasRef} style={{backgroundColor:'black'}}></canvas>;
}
