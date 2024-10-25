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
                    for (let i = 0; i < nodes.length; i++) {
                        if (dist(nodes[i], line.start, line.end) < R) return true;
                    }
                    return false;
                }

                let path: { x: number; y: number }[] = [];
                let nodes: { x: number; y: number }[] = [];

                // dynamic A* pathfinding
                const findPath = () => {
                    createNodes();
                    console.log(nodes);
                    path = [];
                    console.log(isCollision({start:target, end:destination}));
                    if(!isCollision({start:target, end:destination})){
                        path.push(destination);
                    } else {

                    }
                };

                const createNodes = () => {
                    nodes = [];
                    const _R = R * Math.sqrt(2)/2;
                    obstacles.forEach((obstacle) => {
                        nodes.push(
                            { x: obstacle.x - _R, y: obstacle.y - _R },
                            { x: obstacle.x + obstacle.width + _R, y: obstacle.y - _R },
                            { x: obstacle.x + obstacle.width + _R, y: obstacle.y + obstacle.height + _R },
                            { x: obstacle.x - _R, y: obstacle.y + obstacle.height + _R },
                        );
                    });
                }

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

                    requestAnimationFrame(render); // Loop the rendering
                };

                render();

                // Update the destination on canvas click
                canvas.addEventListener('mousedown', (e) => {
                    destination.x = e.offsetX;
                    destination.y = e.offsetY;
                    findPath(); // Recalculate the path on destination change
                });
                canvas.addEventListener('mousemove', (e) => {
                    if (e.buttons === 1) {
                        destination.x = e.offsetX;
                        destination.y = e.offsetY;
                        findPath(); // Recalculate the path on destination change
                    }
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
