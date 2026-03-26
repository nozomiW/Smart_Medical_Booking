/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 8.0, "minX": 0.0, "maxY": 1944.0, "series": [{"data": [[0.0, 8.0], [0.1, 11.0], [0.2, 12.0], [0.3, 12.0], [0.4, 13.0], [0.5, 14.0], [0.6, 15.0], [0.7, 15.0], [0.8, 16.0], [0.9, 17.0], [1.0, 17.0], [1.1, 17.0], [1.2, 18.0], [1.3, 18.0], [1.4, 18.0], [1.5, 18.0], [1.6, 19.0], [1.7, 19.0], [1.8, 20.0], [1.9, 20.0], [2.0, 21.0], [2.1, 21.0], [2.2, 22.0], [2.3, 22.0], [2.4, 22.0], [2.5, 22.0], [2.6, 24.0], [2.7, 24.0], [2.8, 24.0], [2.9, 25.0], [3.0, 25.0], [3.1, 25.0], [3.2, 26.0], [3.3, 26.0], [3.4, 26.0], [3.5, 27.0], [3.6, 27.0], [3.7, 28.0], [3.8, 28.0], [3.9, 28.0], [4.0, 28.0], [4.1, 28.0], [4.2, 28.0], [4.3, 29.0], [4.4, 29.0], [4.5, 29.0], [4.6, 29.0], [4.7, 29.0], [4.8, 30.0], [4.9, 30.0], [5.0, 30.0], [5.1, 30.0], [5.2, 31.0], [5.3, 31.0], [5.4, 31.0], [5.5, 31.0], [5.6, 31.0], [5.7, 32.0], [5.8, 32.0], [5.9, 32.0], [6.0, 32.0], [6.1, 32.0], [6.2, 33.0], [6.3, 33.0], [6.4, 34.0], [6.5, 34.0], [6.6, 34.0], [6.7, 34.0], [6.8, 35.0], [6.9, 37.0], [7.0, 37.0], [7.1, 37.0], [7.2, 38.0], [7.3, 38.0], [7.4, 40.0], [7.5, 40.0], [7.6, 40.0], [7.7, 41.0], [7.8, 41.0], [7.9, 41.0], [8.0, 42.0], [8.1, 42.0], [8.2, 42.0], [8.3, 42.0], [8.4, 43.0], [8.5, 43.0], [8.6, 43.0], [8.7, 43.0], [8.8, 43.0], [8.9, 44.0], [9.0, 44.0], [9.1, 45.0], [9.2, 45.0], [9.3, 45.0], [9.4, 45.0], [9.5, 46.0], [9.6, 46.0], [9.7, 47.0], [9.8, 47.0], [9.9, 47.0], [10.0, 47.0], [10.1, 47.0], [10.2, 48.0], [10.3, 48.0], [10.4, 48.0], [10.5, 48.0], [10.6, 48.0], [10.7, 48.0], [10.8, 49.0], [10.9, 49.0], [11.0, 49.0], [11.1, 49.0], [11.2, 49.0], [11.3, 49.0], [11.4, 49.0], [11.5, 49.0], [11.6, 49.0], [11.7, 49.0], [11.8, 49.0], [11.9, 50.0], [12.0, 50.0], [12.1, 50.0], [12.2, 50.0], [12.3, 50.0], [12.4, 50.0], [12.5, 50.0], [12.6, 50.0], [12.7, 50.0], [12.8, 51.0], [12.9, 51.0], [13.0, 51.0], [13.1, 51.0], [13.2, 51.0], [13.3, 52.0], [13.4, 52.0], [13.5, 52.0], [13.6, 53.0], [13.7, 53.0], [13.8, 53.0], [13.9, 53.0], [14.0, 54.0], [14.1, 54.0], [14.2, 54.0], [14.3, 54.0], [14.4, 55.0], [14.5, 55.0], [14.6, 55.0], [14.7, 55.0], [14.8, 55.0], [14.9, 55.0], [15.0, 55.0], [15.1, 55.0], [15.2, 55.0], [15.3, 55.0], [15.4, 56.0], [15.5, 56.0], [15.6, 56.0], [15.7, 56.0], [15.8, 57.0], [15.9, 57.0], [16.0, 57.0], [16.1, 57.0], [16.2, 57.0], [16.3, 58.0], [16.4, 58.0], [16.5, 58.0], [16.6, 58.0], [16.7, 59.0], [16.8, 59.0], [16.9, 59.0], [17.0, 59.0], [17.1, 59.0], [17.2, 59.0], [17.3, 60.0], [17.4, 60.0], [17.5, 60.0], [17.6, 60.0], [17.7, 60.0], [17.8, 60.0], [17.9, 60.0], [18.0, 61.0], [18.1, 61.0], [18.2, 61.0], [18.3, 62.0], [18.4, 62.0], [18.5, 62.0], [18.6, 62.0], [18.7, 63.0], [18.8, 63.0], [18.9, 63.0], [19.0, 63.0], [19.1, 63.0], [19.2, 63.0], [19.3, 64.0], [19.4, 64.0], [19.5, 64.0], [19.6, 64.0], [19.7, 64.0], [19.8, 64.0], [19.9, 64.0], [20.0, 64.0], [20.1, 64.0], [20.2, 64.0], [20.3, 64.0], [20.4, 64.0], [20.5, 65.0], [20.6, 65.0], [20.7, 65.0], [20.8, 65.0], [20.9, 65.0], [21.0, 65.0], [21.1, 65.0], [21.2, 65.0], [21.3, 66.0], [21.4, 66.0], [21.5, 66.0], [21.6, 66.0], [21.7, 66.0], [21.8, 66.0], [21.9, 66.0], [22.0, 66.0], [22.1, 66.0], [22.2, 66.0], [22.3, 66.0], [22.4, 66.0], [22.5, 66.0], [22.6, 67.0], [22.7, 67.0], [22.8, 67.0], [22.9, 67.0], [23.0, 67.0], [23.1, 67.0], [23.2, 67.0], [23.3, 68.0], [23.4, 68.0], [23.5, 68.0], [23.6, 68.0], [23.7, 68.0], [23.8, 68.0], [23.9, 68.0], [24.0, 69.0], [24.1, 69.0], [24.2, 69.0], [24.3, 69.0], [24.4, 69.0], [24.5, 69.0], [24.6, 70.0], [24.7, 70.0], [24.8, 70.0], [24.9, 70.0], [25.0, 70.0], [25.1, 70.0], [25.2, 70.0], [25.3, 71.0], [25.4, 71.0], [25.5, 71.0], [25.6, 71.0], [25.7, 71.0], [25.8, 71.0], [25.9, 71.0], [26.0, 71.0], [26.1, 72.0], [26.2, 72.0], [26.3, 72.0], [26.4, 72.0], [26.5, 72.0], [26.6, 72.0], [26.7, 72.0], [26.8, 72.0], [26.9, 72.0], [27.0, 73.0], [27.1, 73.0], [27.2, 73.0], [27.3, 73.0], [27.4, 73.0], [27.5, 73.0], [27.6, 74.0], [27.7, 74.0], [27.8, 74.0], [27.9, 74.0], [28.0, 74.0], [28.1, 74.0], [28.2, 74.0], [28.3, 74.0], [28.4, 74.0], [28.5, 74.0], [28.6, 74.0], [28.7, 74.0], [28.8, 75.0], [28.9, 75.0], [29.0, 75.0], [29.1, 75.0], [29.2, 75.0], [29.3, 75.0], [29.4, 75.0], [29.5, 75.0], [29.6, 76.0], [29.7, 76.0], [29.8, 76.0], [29.9, 76.0], [30.0, 76.0], [30.1, 76.0], [30.2, 76.0], [30.3, 76.0], [30.4, 76.0], [30.5, 76.0], [30.6, 76.0], [30.7, 76.0], [30.8, 76.0], [30.9, 76.0], [31.0, 76.0], [31.1, 76.0], [31.2, 77.0], [31.3, 77.0], [31.4, 77.0], [31.5, 78.0], [31.6, 78.0], [31.7, 78.0], [31.8, 78.0], [31.9, 78.0], [32.0, 78.0], [32.1, 78.0], [32.2, 79.0], [32.3, 79.0], [32.4, 79.0], [32.5, 79.0], [32.6, 79.0], [32.7, 79.0], [32.8, 79.0], [32.9, 79.0], [33.0, 79.0], [33.1, 79.0], [33.2, 79.0], [33.3, 79.0], [33.4, 79.0], [33.5, 80.0], [33.6, 80.0], [33.7, 80.0], [33.8, 80.0], [33.9, 80.0], [34.0, 80.0], [34.1, 80.0], [34.2, 80.0], [34.3, 80.0], [34.4, 80.0], [34.5, 80.0], [34.6, 81.0], [34.7, 81.0], [34.8, 81.0], [34.9, 81.0], [35.0, 81.0], [35.1, 81.0], [35.2, 81.0], [35.3, 81.0], [35.4, 81.0], [35.5, 81.0], [35.6, 81.0], [35.7, 81.0], [35.8, 81.0], [35.9, 81.0], [36.0, 81.0], [36.1, 81.0], [36.2, 81.0], [36.3, 81.0], [36.4, 81.0], [36.5, 82.0], [36.6, 82.0], [36.7, 82.0], [36.8, 82.0], [36.9, 82.0], [37.0, 82.0], [37.1, 82.0], [37.2, 82.0], [37.3, 82.0], [37.4, 82.0], [37.5, 82.0], [37.6, 83.0], [37.7, 83.0], [37.8, 83.0], [37.9, 83.0], [38.0, 83.0], [38.1, 83.0], [38.2, 83.0], [38.3, 83.0], [38.4, 83.0], [38.5, 84.0], [38.6, 84.0], [38.7, 84.0], [38.8, 84.0], [38.9, 84.0], [39.0, 84.0], [39.1, 84.0], [39.2, 84.0], [39.3, 84.0], [39.4, 84.0], [39.5, 84.0], [39.6, 84.0], [39.7, 84.0], [39.8, 84.0], [39.9, 85.0], [40.0, 85.0], [40.1, 85.0], [40.2, 85.0], [40.3, 85.0], [40.4, 85.0], [40.5, 85.0], [40.6, 85.0], [40.7, 85.0], [40.8, 85.0], [40.9, 85.0], [41.0, 85.0], [41.1, 85.0], [41.2, 85.0], [41.3, 85.0], [41.4, 86.0], [41.5, 86.0], [41.6, 86.0], [41.7, 86.0], [41.8, 86.0], [41.9, 87.0], [42.0, 87.0], [42.1, 87.0], [42.2, 87.0], [42.3, 87.0], [42.4, 87.0], [42.5, 87.0], [42.6, 87.0], [42.7, 88.0], [42.8, 88.0], [42.9, 88.0], [43.0, 88.0], [43.1, 88.0], [43.2, 88.0], [43.3, 88.0], [43.4, 88.0], [43.5, 89.0], [43.6, 89.0], [43.7, 89.0], [43.8, 89.0], [43.9, 89.0], [44.0, 89.0], [44.1, 89.0], [44.2, 89.0], [44.3, 89.0], [44.4, 89.0], [44.5, 89.0], [44.6, 89.0], [44.7, 89.0], [44.8, 89.0], [44.9, 89.0], [45.0, 89.0], [45.1, 89.0], [45.2, 90.0], [45.3, 90.0], [45.4, 90.0], [45.5, 90.0], [45.6, 91.0], [45.7, 91.0], [45.8, 91.0], [45.9, 91.0], [46.0, 91.0], [46.1, 91.0], [46.2, 91.0], [46.3, 91.0], [46.4, 91.0], [46.5, 91.0], [46.6, 91.0], [46.7, 91.0], [46.8, 91.0], [46.9, 91.0], [47.0, 91.0], [47.1, 91.0], [47.2, 91.0], [47.3, 91.0], [47.4, 92.0], [47.5, 92.0], [47.6, 92.0], [47.7, 92.0], [47.8, 92.0], [47.9, 92.0], [48.0, 92.0], [48.1, 92.0], [48.2, 93.0], [48.3, 93.0], [48.4, 93.0], [48.5, 93.0], [48.6, 93.0], [48.7, 93.0], [48.8, 93.0], [48.9, 93.0], [49.0, 93.0], [49.1, 93.0], [49.2, 93.0], [49.3, 93.0], [49.4, 94.0], [49.5, 94.0], [49.6, 94.0], [49.7, 95.0], [49.8, 95.0], [49.9, 95.0], [50.0, 95.0], [50.1, 96.0], [50.2, 96.0], [50.3, 96.0], [50.4, 96.0], [50.5, 96.0], [50.6, 96.0], [50.7, 96.0], [50.8, 96.0], [50.9, 97.0], [51.0, 97.0], [51.1, 97.0], [51.2, 98.0], [51.3, 98.0], [51.4, 98.0], [51.5, 98.0], [51.6, 98.0], [51.7, 98.0], [51.8, 98.0], [51.9, 99.0], [52.0, 99.0], [52.1, 99.0], [52.2, 99.0], [52.3, 99.0], [52.4, 99.0], [52.5, 100.0], [52.6, 100.0], [52.7, 101.0], [52.8, 101.0], [52.9, 101.0], [53.0, 101.0], [53.1, 102.0], [53.2, 102.0], [53.3, 102.0], [53.4, 102.0], [53.5, 102.0], [53.6, 102.0], [53.7, 102.0], [53.8, 102.0], [53.9, 103.0], [54.0, 103.0], [54.1, 103.0], [54.2, 103.0], [54.3, 103.0], [54.4, 103.0], [54.5, 103.0], [54.6, 104.0], [54.7, 104.0], [54.8, 104.0], [54.9, 104.0], [55.0, 104.0], [55.1, 105.0], [55.2, 105.0], [55.3, 105.0], [55.4, 106.0], [55.5, 106.0], [55.6, 107.0], [55.7, 107.0], [55.8, 107.0], [55.9, 107.0], [56.0, 107.0], [56.1, 107.0], [56.2, 107.0], [56.3, 107.0], [56.4, 108.0], [56.5, 108.0], [56.6, 108.0], [56.7, 108.0], [56.8, 108.0], [56.9, 108.0], [57.0, 108.0], [57.1, 108.0], [57.2, 109.0], [57.3, 109.0], [57.4, 109.0], [57.5, 109.0], [57.6, 109.0], [57.7, 110.0], [57.8, 110.0], [57.9, 110.0], [58.0, 110.0], [58.1, 110.0], [58.2, 110.0], [58.3, 110.0], [58.4, 110.0], [58.5, 110.0], [58.6, 111.0], [58.7, 111.0], [58.8, 111.0], [58.9, 111.0], [59.0, 111.0], [59.1, 111.0], [59.2, 111.0], [59.3, 111.0], [59.4, 112.0], [59.5, 112.0], [59.6, 112.0], [59.7, 112.0], [59.8, 112.0], [59.9, 112.0], [60.0, 112.0], [60.1, 112.0], [60.2, 112.0], [60.3, 112.0], [60.4, 112.0], [60.5, 113.0], [60.6, 113.0], [60.7, 113.0], [60.8, 113.0], [60.9, 114.0], [61.0, 114.0], [61.1, 114.0], [61.2, 114.0], [61.3, 115.0], [61.4, 115.0], [61.5, 115.0], [61.6, 116.0], [61.7, 116.0], [61.8, 116.0], [61.9, 116.0], [62.0, 116.0], [62.1, 116.0], [62.2, 116.0], [62.3, 117.0], [62.4, 117.0], [62.5, 117.0], [62.6, 117.0], [62.7, 117.0], [62.8, 117.0], [62.9, 118.0], [63.0, 118.0], [63.1, 118.0], [63.2, 118.0], [63.3, 118.0], [63.4, 119.0], [63.5, 119.0], [63.6, 120.0], [63.7, 120.0], [63.8, 120.0], [63.9, 121.0], [64.0, 121.0], [64.1, 121.0], [64.2, 121.0], [64.3, 121.0], [64.4, 122.0], [64.5, 122.0], [64.6, 122.0], [64.7, 122.0], [64.8, 122.0], [64.9, 124.0], [65.0, 124.0], [65.1, 124.0], [65.2, 124.0], [65.3, 124.0], [65.4, 125.0], [65.5, 125.0], [65.6, 125.0], [65.7, 127.0], [65.8, 127.0], [65.9, 128.0], [66.0, 131.0], [66.1, 132.0], [66.2, 132.0], [66.3, 133.0], [66.4, 134.0], [66.5, 134.0], [66.6, 134.0], [66.7, 136.0], [66.8, 137.0], [66.9, 137.0], [67.0, 138.0], [67.1, 139.0], [67.2, 139.0], [67.3, 140.0], [67.4, 140.0], [67.5, 140.0], [67.6, 141.0], [67.7, 142.0], [67.8, 142.0], [67.9, 143.0], [68.0, 144.0], [68.1, 144.0], [68.2, 144.0], [68.3, 145.0], [68.4, 146.0], [68.5, 146.0], [68.6, 147.0], [68.7, 147.0], [68.8, 147.0], [68.9, 148.0], [69.0, 148.0], [69.1, 149.0], [69.2, 149.0], [69.3, 149.0], [69.4, 150.0], [69.5, 151.0], [69.6, 151.0], [69.7, 152.0], [69.8, 152.0], [69.9, 152.0], [70.0, 152.0], [70.1, 153.0], [70.2, 153.0], [70.3, 153.0], [70.4, 153.0], [70.5, 154.0], [70.6, 154.0], [70.7, 154.0], [70.8, 154.0], [70.9, 155.0], [71.0, 155.0], [71.1, 155.0], [71.2, 155.0], [71.3, 155.0], [71.4, 155.0], [71.5, 156.0], [71.6, 156.0], [71.7, 156.0], [71.8, 156.0], [71.9, 156.0], [72.0, 157.0], [72.1, 157.0], [72.2, 157.0], [72.3, 157.0], [72.4, 157.0], [72.5, 157.0], [72.6, 158.0], [72.7, 159.0], [72.8, 160.0], [72.9, 160.0], [73.0, 160.0], [73.1, 162.0], [73.2, 162.0], [73.3, 162.0], [73.4, 162.0], [73.5, 163.0], [73.6, 163.0], [73.7, 163.0], [73.8, 163.0], [73.9, 163.0], [74.0, 164.0], [74.1, 164.0], [74.2, 165.0], [74.3, 165.0], [74.4, 165.0], [74.5, 165.0], [74.6, 165.0], [74.7, 166.0], [74.8, 166.0], [74.9, 166.0], [75.0, 166.0], [75.1, 167.0], [75.2, 167.0], [75.3, 167.0], [75.4, 168.0], [75.5, 169.0], [75.6, 170.0], [75.7, 170.0], [75.8, 171.0], [75.9, 172.0], [76.0, 174.0], [76.1, 174.0], [76.2, 174.0], [76.3, 175.0], [76.4, 177.0], [76.5, 178.0], [76.6, 179.0], [76.7, 180.0], [76.8, 180.0], [76.9, 180.0], [77.0, 180.0], [77.1, 181.0], [77.2, 181.0], [77.3, 182.0], [77.4, 182.0], [77.5, 184.0], [77.6, 184.0], [77.7, 185.0], [77.8, 186.0], [77.9, 187.0], [78.0, 188.0], [78.1, 188.0], [78.2, 190.0], [78.3, 191.0], [78.4, 191.0], [78.5, 192.0], [78.6, 192.0], [78.7, 193.0], [78.8, 194.0], [78.9, 200.0], [79.0, 200.0], [79.1, 201.0], [79.2, 201.0], [79.3, 201.0], [79.4, 204.0], [79.5, 204.0], [79.6, 212.0], [79.7, 232.0], [79.8, 237.0], [79.9, 238.0], [80.0, 702.0], [80.1, 828.0], [80.2, 832.0], [80.3, 833.0], [80.4, 836.0], [80.5, 836.0], [80.6, 838.0], [80.7, 838.0], [80.8, 838.0], [80.9, 839.0], [81.0, 839.0], [81.1, 842.0], [81.2, 843.0], [81.3, 844.0], [81.4, 845.0], [81.5, 845.0], [81.6, 849.0], [81.7, 849.0], [81.8, 850.0], [81.9, 850.0], [82.0, 850.0], [82.1, 850.0], [82.2, 850.0], [82.3, 851.0], [82.4, 852.0], [82.5, 853.0], [82.6, 853.0], [82.7, 854.0], [82.8, 854.0], [82.9, 854.0], [83.0, 854.0], [83.1, 855.0], [83.2, 855.0], [83.3, 856.0], [83.4, 856.0], [83.5, 856.0], [83.6, 857.0], [83.7, 857.0], [83.8, 857.0], [83.9, 857.0], [84.0, 858.0], [84.1, 859.0], [84.2, 859.0], [84.3, 859.0], [84.4, 859.0], [84.5, 860.0], [84.6, 860.0], [84.7, 860.0], [84.8, 860.0], [84.9, 861.0], [85.0, 861.0], [85.1, 861.0], [85.2, 862.0], [85.3, 862.0], [85.4, 863.0], [85.5, 865.0], [85.6, 866.0], [85.7, 866.0], [85.8, 866.0], [85.9, 866.0], [86.0, 866.0], [86.1, 866.0], [86.2, 867.0], [86.3, 867.0], [86.4, 868.0], [86.5, 868.0], [86.6, 868.0], [86.7, 869.0], [86.8, 869.0], [86.9, 869.0], [87.0, 869.0], [87.1, 869.0], [87.2, 870.0], [87.3, 871.0], [87.4, 871.0], [87.5, 871.0], [87.6, 871.0], [87.7, 872.0], [87.8, 872.0], [87.9, 872.0], [88.0, 873.0], [88.1, 873.0], [88.2, 873.0], [88.3, 874.0], [88.4, 874.0], [88.5, 874.0], [88.6, 874.0], [88.7, 874.0], [88.8, 874.0], [88.9, 874.0], [89.0, 874.0], [89.1, 875.0], [89.2, 875.0], [89.3, 876.0], [89.4, 876.0], [89.5, 876.0], [89.6, 876.0], [89.7, 876.0], [89.8, 876.0], [89.9, 877.0], [90.0, 877.0], [90.1, 877.0], [90.2, 878.0], [90.3, 878.0], [90.4, 879.0], [90.5, 879.0], [90.6, 879.0], [90.7, 879.0], [90.8, 880.0], [90.9, 880.0], [91.0, 882.0], [91.1, 882.0], [91.2, 882.0], [91.3, 882.0], [91.4, 883.0], [91.5, 884.0], [91.6, 884.0], [91.7, 885.0], [91.8, 885.0], [91.9, 886.0], [92.0, 886.0], [92.1, 886.0], [92.2, 886.0], [92.3, 886.0], [92.4, 887.0], [92.5, 887.0], [92.6, 887.0], [92.7, 887.0], [92.8, 887.0], [92.9, 888.0], [93.0, 888.0], [93.1, 891.0], [93.2, 891.0], [93.3, 892.0], [93.4, 892.0], [93.5, 892.0], [93.6, 893.0], [93.7, 898.0], [93.8, 899.0], [93.9, 901.0], [94.0, 1512.0], [94.1, 1518.0], [94.2, 1518.0], [94.3, 1522.0], [94.4, 1522.0], [94.5, 1526.0], [94.6, 1534.0], [94.7, 1535.0], [94.8, 1651.0], [94.9, 1656.0], [95.0, 1658.0], [95.1, 1660.0], [95.2, 1660.0], [95.3, 1660.0], [95.4, 1661.0], [95.5, 1661.0], [95.6, 1661.0], [95.7, 1661.0], [95.8, 1661.0], [95.9, 1662.0], [96.0, 1662.0], [96.1, 1662.0], [96.2, 1663.0], [96.3, 1663.0], [96.4, 1663.0], [96.5, 1664.0], [96.6, 1666.0], [96.7, 1666.0], [96.8, 1667.0], [96.9, 1669.0], [97.0, 1669.0], [97.1, 1671.0], [97.2, 1673.0], [97.3, 1674.0], [97.4, 1675.0], [97.5, 1677.0], [97.6, 1677.0], [97.7, 1678.0], [97.8, 1681.0], [97.9, 1868.0], [98.0, 1875.0], [98.1, 1883.0], [98.2, 1884.0], [98.3, 1886.0], [98.4, 1896.0], [98.5, 1896.0], [98.6, 1898.0], [98.7, 1902.0], [98.8, 1905.0], [98.9, 1905.0], [99.0, 1918.0], [99.1, 1919.0], [99.2, 1921.0], [99.3, 1926.0], [99.4, 1926.0], [99.5, 1929.0], [99.6, 1931.0], [99.7, 1941.0], [99.8, 1943.0], [99.9, 1944.0]], "isOverall": false, "label": "抢号请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 524.0, "series": [{"data": [[0.0, 524.0], [700.0, 1.0], [1500.0, 8.0], [800.0, 138.0], [1600.0, 31.0], [100.0, 265.0], [200.0, 11.0], [900.0, 1.0], [1800.0, 8.0], [1900.0, 13.0]], "isOverall": false, "label": "抢号请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 1900.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 9.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 800.0, "series": [{"data": [[0.0, 800.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 139.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 52.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 9.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 180.6069999999999, "minX": 1.7745153E12, "maxY": 180.6069999999999, "series": [{"data": [[1.7745153E12, 180.6069999999999]], "isOverall": false, "label": "抢号测试-基线", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745153E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 11.666666666666666, "minX": 2.0, "maxY": 359.270911360799, "series": [{"data": [[2.0, 76.0], [3.0, 65.0], [6.0, 68.33333333333333], [9.0, 69.66666666666667], [17.0, 78.0], [21.0, 68.5], [22.0, 69.5], [24.0, 62.0], [28.0, 72.66666666666667], [29.0, 62.0], [30.0, 80.6], [31.0, 68.0], [33.0, 76.2], [35.0, 65.0], [37.0, 82.0], [39.0, 59.0], [41.0, 74.66666666666667], [43.0, 77.5], [45.0, 74.33333333333333], [47.0, 55.0], [50.0, 70.0], [52.0, 79.33333333333333], [54.0, 76.66666666666667], [56.0, 67.0], [59.0, 65.5], [63.0, 62.0], [66.0, 71.0], [65.0, 68.0], [71.0, 75.0], [69.0, 78.0], [68.0, 71.0], [75.0, 70.0], [74.0, 65.0], [73.0, 70.0], [72.0, 66.66666666666667], [79.0, 77.0], [77.0, 78.0], [82.0, 76.0], [81.0, 58.5], [87.0, 63.5], [86.0, 66.0], [84.0, 69.5], [91.0, 67.8], [94.0, 66.66666666666667], [99.0, 61.666666666666664], [98.0, 65.0], [97.0, 64.0], [103.0, 55.0], [102.0, 58.0], [101.0, 56.0], [106.0, 57.0], [104.0, 58.0], [109.0, 61.0], [115.0, 49.0], [112.0, 57.0], [119.0, 48.0], [118.0, 50.0], [122.0, 49.5], [121.0, 52.2], [127.0, 48.5], [125.0, 50.666666666666664], [135.0, 40.5], [134.0, 32.0], [131.0, 55.5], [129.0, 46.5], [128.0, 55.0], [142.0, 27.0], [141.0, 49.0], [140.0, 49.0], [139.0, 28.0], [137.0, 29.5], [151.0, 36.5], [148.0, 40.0], [147.0, 30.0], [146.0, 34.0], [145.0, 30.5], [158.0, 34.0], [156.0, 30.0], [155.0, 37.0], [154.0, 37.0], [153.0, 29.0], [152.0, 31.0], [166.0, 29.0], [163.0, 22.0], [162.0, 30.0], [161.0, 33.666666666666664], [160.0, 31.0], [175.0, 27.0], [173.0, 29.5], [172.0, 27.0], [183.0, 20.0], [182.0, 23.666666666666668], [181.0, 25.0], [180.0, 27.0], [178.0, 26.8], [189.0, 18.0], [187.0, 20.333333333333332], [186.0, 22.0], [199.0, 11.666666666666666], [196.0, 13.0], [195.0, 14.0], [194.0, 16.0], [193.0, 16.666666666666668], [192.0, 17.5], [200.0, 359.270911360799]], "isOverall": false, "label": "抢号请求-基线", "isController": false}, {"data": [[180.6069999999999, 298.32900000000006]], "isOverall": false, "label": "抢号请求-基线-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 200.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 2235.9666666666667, "minX": 1.7745153E12, "maxY": 7731.283333333334, "series": [{"data": [[1.7745153E12, 2235.9666666666667]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7745153E12, 7731.283333333334]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745153E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 298.32900000000006, "minX": 1.7745153E12, "maxY": 298.32900000000006, "series": [{"data": [[1.7745153E12, 298.32900000000006]], "isOverall": false, "label": "抢号请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745153E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 298.00599999999923, "minX": 1.7745153E12, "maxY": 298.00599999999923, "series": [{"data": [[1.7745153E12, 298.00599999999923]], "isOverall": false, "label": "抢号请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745153E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 6.926000000000005, "minX": 1.7745153E12, "maxY": 6.926000000000005, "series": [{"data": [[1.7745153E12, 6.926000000000005]], "isOverall": false, "label": "抢号请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745153E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 8.0, "minX": 1.7745153E12, "maxY": 1944.0, "series": [{"data": [[1.7745153E12, 1944.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7745153E12, 875.8000000000001]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7745153E12, 1918.08]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7745153E12, 1658.8]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.7745153E12, 8.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7745153E12, 94.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745153E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 79.0, "minX": 140.0, "maxY": 1522.0, "series": [{"data": [[140.0, 869.0], [373.0, 137.0], [487.0, 79.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[140.0, 702.0], [373.0, 1522.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 487.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 79.0, "minX": 140.0, "maxY": 1522.0, "series": [{"data": [[140.0, 869.0], [373.0, 137.0], [487.0, 79.0]], "isOverall": false, "label": "Successes", "isController": false}, {"data": [[140.0, 701.0], [373.0, 1522.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 487.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 16.666666666666668, "minX": 1.7745153E12, "maxY": 16.666666666666668, "series": [{"data": [[1.7745153E12, 16.666666666666668]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745153E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 0.15, "minX": 1.7745153E12, "maxY": 16.516666666666666, "series": [{"data": [[1.7745153E12, 16.516666666666666]], "isOverall": false, "label": "200", "isController": false}, {"data": [[1.7745153E12, 0.15]], "isOverall": false, "label": "500", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745153E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 0.15, "minX": 1.7745153E12, "maxY": 16.516666666666666, "series": [{"data": [[1.7745153E12, 16.516666666666666]], "isOverall": false, "label": "抢号请求-基线-success", "isController": false}, {"data": [[1.7745153E12, 0.15]], "isOverall": false, "label": "抢号请求-基线-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745153E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 0.15, "minX": 1.7745153E12, "maxY": 16.516666666666666, "series": [{"data": [[1.7745153E12, 16.516666666666666]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.7745153E12, 0.15]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745153E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

