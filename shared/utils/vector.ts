export function isPointInBound(point: Point, bound: Bound):boolean{
    return point.x >= bound.x && point.x <= bound.x + bound.width && point.y >= bound.y && point.y <= bound.y + bound.height;
}
