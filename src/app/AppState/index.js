import NpyFile from "NpyMarker/Core/NpyFile"
import Colormap from "NpyMarker/Plot/Colormap"

export default {
    npyFile: new NpyFile(),
    npyName: null,
    colorMap: new Colormap(),
    dimension: 0,
    index: 0,
    marks: new Set()
}