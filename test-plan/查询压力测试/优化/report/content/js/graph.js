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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 349.0, "series": [{"data": [[0.0, 1.0], [0.1, 3.0], [0.2, 4.0], [0.3, 5.0], [0.4, 6.0], [0.5, 6.0], [0.6, 7.0], [0.7, 7.0], [0.8, 8.0], [0.9, 8.0], [1.0, 9.0], [1.1, 9.0], [1.2, 9.0], [1.3, 10.0], [1.4, 10.0], [1.5, 10.0], [1.6, 11.0], [1.7, 11.0], [1.8, 11.0], [1.9, 12.0], [2.0, 12.0], [2.1, 12.0], [2.2, 12.0], [2.3, 13.0], [2.4, 13.0], [2.5, 13.0], [2.6, 13.0], [2.7, 14.0], [2.8, 14.0], [2.9, 14.0], [3.0, 14.0], [3.1, 15.0], [3.2, 15.0], [3.3, 15.0], [3.4, 15.0], [3.5, 16.0], [3.6, 16.0], [3.7, 16.0], [3.8, 16.0], [3.9, 16.0], [4.0, 17.0], [4.1, 17.0], [4.2, 17.0], [4.3, 17.0], [4.4, 17.0], [4.5, 18.0], [4.6, 18.0], [4.7, 18.0], [4.8, 18.0], [4.9, 18.0], [5.0, 19.0], [5.1, 19.0], [5.2, 19.0], [5.3, 19.0], [5.4, 19.0], [5.5, 20.0], [5.6, 20.0], [5.7, 20.0], [5.8, 20.0], [5.9, 20.0], [6.0, 20.0], [6.1, 21.0], [6.2, 21.0], [6.3, 21.0], [6.4, 21.0], [6.5, 21.0], [6.6, 21.0], [6.7, 22.0], [6.8, 22.0], [6.9, 22.0], [7.0, 22.0], [7.1, 22.0], [7.2, 22.0], [7.3, 23.0], [7.4, 23.0], [7.5, 23.0], [7.6, 23.0], [7.7, 23.0], [7.8, 23.0], [7.9, 24.0], [8.0, 24.0], [8.1, 24.0], [8.2, 24.0], [8.3, 24.0], [8.4, 24.0], [8.5, 24.0], [8.6, 25.0], [8.7, 25.0], [8.8, 25.0], [8.9, 25.0], [9.0, 25.0], [9.1, 25.0], [9.2, 25.0], [9.3, 26.0], [9.4, 26.0], [9.5, 26.0], [9.6, 26.0], [9.7, 26.0], [9.8, 26.0], [9.9, 26.0], [10.0, 27.0], [10.1, 27.0], [10.2, 27.0], [10.3, 27.0], [10.4, 27.0], [10.5, 27.0], [10.6, 27.0], [10.7, 28.0], [10.8, 28.0], [10.9, 28.0], [11.0, 28.0], [11.1, 28.0], [11.2, 28.0], [11.3, 28.0], [11.4, 28.0], [11.5, 29.0], [11.6, 29.0], [11.7, 29.0], [11.8, 29.0], [11.9, 29.0], [12.0, 29.0], [12.1, 29.0], [12.2, 29.0], [12.3, 30.0], [12.4, 30.0], [12.5, 30.0], [12.6, 30.0], [12.7, 30.0], [12.8, 30.0], [12.9, 30.0], [13.0, 30.0], [13.1, 31.0], [13.2, 31.0], [13.3, 31.0], [13.4, 31.0], [13.5, 31.0], [13.6, 31.0], [13.7, 31.0], [13.8, 31.0], [13.9, 32.0], [14.0, 32.0], [14.1, 32.0], [14.2, 32.0], [14.3, 32.0], [14.4, 32.0], [14.5, 32.0], [14.6, 32.0], [14.7, 32.0], [14.8, 33.0], [14.9, 33.0], [15.0, 33.0], [15.1, 33.0], [15.2, 33.0], [15.3, 33.0], [15.4, 33.0], [15.5, 33.0], [15.6, 33.0], [15.7, 34.0], [15.8, 34.0], [15.9, 34.0], [16.0, 34.0], [16.1, 34.0], [16.2, 34.0], [16.3, 34.0], [16.4, 34.0], [16.5, 35.0], [16.6, 35.0], [16.7, 35.0], [16.8, 35.0], [16.9, 35.0], [17.0, 35.0], [17.1, 35.0], [17.2, 35.0], [17.3, 35.0], [17.4, 35.0], [17.5, 36.0], [17.6, 36.0], [17.7, 36.0], [17.8, 36.0], [17.9, 36.0], [18.0, 36.0], [18.1, 36.0], [18.2, 36.0], [18.3, 36.0], [18.4, 37.0], [18.5, 37.0], [18.6, 37.0], [18.7, 37.0], [18.8, 37.0], [18.9, 37.0], [19.0, 37.0], [19.1, 37.0], [19.2, 37.0], [19.3, 37.0], [19.4, 38.0], [19.5, 38.0], [19.6, 38.0], [19.7, 38.0], [19.8, 38.0], [19.9, 38.0], [20.0, 38.0], [20.1, 38.0], [20.2, 38.0], [20.3, 38.0], [20.4, 39.0], [20.5, 39.0], [20.6, 39.0], [20.7, 39.0], [20.8, 39.0], [20.9, 39.0], [21.0, 39.0], [21.1, 39.0], [21.2, 39.0], [21.3, 39.0], [21.4, 40.0], [21.5, 40.0], [21.6, 40.0], [21.7, 40.0], [21.8, 40.0], [21.9, 40.0], [22.0, 40.0], [22.1, 40.0], [22.2, 40.0], [22.3, 40.0], [22.4, 40.0], [22.5, 41.0], [22.6, 41.0], [22.7, 41.0], [22.8, 41.0], [22.9, 41.0], [23.0, 41.0], [23.1, 41.0], [23.2, 41.0], [23.3, 41.0], [23.4, 41.0], [23.5, 42.0], [23.6, 42.0], [23.7, 42.0], [23.8, 42.0], [23.9, 42.0], [24.0, 42.0], [24.1, 42.0], [24.2, 42.0], [24.3, 42.0], [24.4, 42.0], [24.5, 42.0], [24.6, 43.0], [24.7, 43.0], [24.8, 43.0], [24.9, 43.0], [25.0, 43.0], [25.1, 43.0], [25.2, 43.0], [25.3, 43.0], [25.4, 43.0], [25.5, 43.0], [25.6, 44.0], [25.7, 44.0], [25.8, 44.0], [25.9, 44.0], [26.0, 44.0], [26.1, 44.0], [26.2, 44.0], [26.3, 44.0], [26.4, 44.0], [26.5, 44.0], [26.6, 44.0], [26.7, 45.0], [26.8, 45.0], [26.9, 45.0], [27.0, 45.0], [27.1, 45.0], [27.2, 45.0], [27.3, 45.0], [27.4, 45.0], [27.5, 45.0], [27.6, 45.0], [27.7, 45.0], [27.8, 46.0], [27.9, 46.0], [28.0, 46.0], [28.1, 46.0], [28.2, 46.0], [28.3, 46.0], [28.4, 46.0], [28.5, 46.0], [28.6, 46.0], [28.7, 46.0], [28.8, 46.0], [28.9, 47.0], [29.0, 47.0], [29.1, 47.0], [29.2, 47.0], [29.3, 47.0], [29.4, 47.0], [29.5, 47.0], [29.6, 47.0], [29.7, 47.0], [29.8, 47.0], [29.9, 47.0], [30.0, 47.0], [30.1, 48.0], [30.2, 48.0], [30.3, 48.0], [30.4, 48.0], [30.5, 48.0], [30.6, 48.0], [30.7, 48.0], [30.8, 48.0], [30.9, 48.0], [31.0, 48.0], [31.1, 48.0], [31.2, 49.0], [31.3, 49.0], [31.4, 49.0], [31.5, 49.0], [31.6, 49.0], [31.7, 49.0], [31.8, 49.0], [31.9, 49.0], [32.0, 49.0], [32.1, 49.0], [32.2, 49.0], [32.3, 49.0], [32.4, 50.0], [32.5, 50.0], [32.6, 50.0], [32.7, 50.0], [32.8, 50.0], [32.9, 50.0], [33.0, 50.0], [33.1, 50.0], [33.2, 50.0], [33.3, 50.0], [33.4, 50.0], [33.5, 50.0], [33.6, 51.0], [33.7, 51.0], [33.8, 51.0], [33.9, 51.0], [34.0, 51.0], [34.1, 51.0], [34.2, 51.0], [34.3, 51.0], [34.4, 51.0], [34.5, 51.0], [34.6, 51.0], [34.7, 52.0], [34.8, 52.0], [34.9, 52.0], [35.0, 52.0], [35.1, 52.0], [35.2, 52.0], [35.3, 52.0], [35.4, 52.0], [35.5, 52.0], [35.6, 52.0], [35.7, 52.0], [35.8, 52.0], [35.9, 53.0], [36.0, 53.0], [36.1, 53.0], [36.2, 53.0], [36.3, 53.0], [36.4, 53.0], [36.5, 53.0], [36.6, 53.0], [36.7, 53.0], [36.8, 53.0], [36.9, 53.0], [37.0, 53.0], [37.1, 54.0], [37.2, 54.0], [37.3, 54.0], [37.4, 54.0], [37.5, 54.0], [37.6, 54.0], [37.7, 54.0], [37.8, 54.0], [37.9, 54.0], [38.0, 54.0], [38.1, 54.0], [38.2, 54.0], [38.3, 55.0], [38.4, 55.0], [38.5, 55.0], [38.6, 55.0], [38.7, 55.0], [38.8, 55.0], [38.9, 55.0], [39.0, 55.0], [39.1, 55.0], [39.2, 55.0], [39.3, 55.0], [39.4, 55.0], [39.5, 56.0], [39.6, 56.0], [39.7, 56.0], [39.8, 56.0], [39.9, 56.0], [40.0, 56.0], [40.1, 56.0], [40.2, 56.0], [40.3, 56.0], [40.4, 56.0], [40.5, 56.0], [40.6, 56.0], [40.7, 57.0], [40.8, 57.0], [40.9, 57.0], [41.0, 57.0], [41.1, 57.0], [41.2, 57.0], [41.3, 57.0], [41.4, 57.0], [41.5, 57.0], [41.6, 57.0], [41.7, 57.0], [41.8, 58.0], [41.9, 58.0], [42.0, 58.0], [42.1, 58.0], [42.2, 58.0], [42.3, 58.0], [42.4, 58.0], [42.5, 58.0], [42.6, 58.0], [42.7, 58.0], [42.8, 58.0], [42.9, 58.0], [43.0, 59.0], [43.1, 59.0], [43.2, 59.0], [43.3, 59.0], [43.4, 59.0], [43.5, 59.0], [43.6, 59.0], [43.7, 59.0], [43.8, 59.0], [43.9, 59.0], [44.0, 59.0], [44.1, 59.0], [44.2, 59.0], [44.3, 60.0], [44.4, 60.0], [44.5, 60.0], [44.6, 60.0], [44.7, 60.0], [44.8, 60.0], [44.9, 60.0], [45.0, 60.0], [45.1, 60.0], [45.2, 60.0], [45.3, 60.0], [45.4, 60.0], [45.5, 61.0], [45.6, 61.0], [45.7, 61.0], [45.8, 61.0], [45.9, 61.0], [46.0, 61.0], [46.1, 61.0], [46.2, 61.0], [46.3, 61.0], [46.4, 61.0], [46.5, 61.0], [46.6, 61.0], [46.7, 62.0], [46.8, 62.0], [46.9, 62.0], [47.0, 62.0], [47.1, 62.0], [47.2, 62.0], [47.3, 62.0], [47.4, 62.0], [47.5, 62.0], [47.6, 62.0], [47.7, 62.0], [47.8, 62.0], [47.9, 63.0], [48.0, 63.0], [48.1, 63.0], [48.2, 63.0], [48.3, 63.0], [48.4, 63.0], [48.5, 63.0], [48.6, 63.0], [48.7, 63.0], [48.8, 63.0], [48.9, 63.0], [49.0, 63.0], [49.1, 64.0], [49.2, 64.0], [49.3, 64.0], [49.4, 64.0], [49.5, 64.0], [49.6, 64.0], [49.7, 64.0], [49.8, 64.0], [49.9, 64.0], [50.0, 64.0], [50.1, 64.0], [50.2, 65.0], [50.3, 65.0], [50.4, 65.0], [50.5, 65.0], [50.6, 65.0], [50.7, 65.0], [50.8, 65.0], [50.9, 65.0], [51.0, 65.0], [51.1, 65.0], [51.2, 65.0], [51.3, 65.0], [51.4, 66.0], [51.5, 66.0], [51.6, 66.0], [51.7, 66.0], [51.8, 66.0], [51.9, 66.0], [52.0, 66.0], [52.1, 66.0], [52.2, 66.0], [52.3, 66.0], [52.4, 66.0], [52.5, 67.0], [52.6, 67.0], [52.7, 67.0], [52.8, 67.0], [52.9, 67.0], [53.0, 67.0], [53.1, 67.0], [53.2, 67.0], [53.3, 67.0], [53.4, 67.0], [53.5, 67.0], [53.6, 67.0], [53.7, 67.0], [53.8, 68.0], [53.9, 68.0], [54.0, 68.0], [54.1, 68.0], [54.2, 68.0], [54.3, 68.0], [54.4, 68.0], [54.5, 68.0], [54.6, 68.0], [54.7, 68.0], [54.8, 68.0], [54.9, 69.0], [55.0, 69.0], [55.1, 69.0], [55.2, 69.0], [55.3, 69.0], [55.4, 69.0], [55.5, 69.0], [55.6, 69.0], [55.7, 69.0], [55.8, 69.0], [55.9, 69.0], [56.0, 69.0], [56.1, 70.0], [56.2, 70.0], [56.3, 70.0], [56.4, 70.0], [56.5, 70.0], [56.6, 70.0], [56.7, 70.0], [56.8, 70.0], [56.9, 70.0], [57.0, 70.0], [57.1, 70.0], [57.2, 71.0], [57.3, 71.0], [57.4, 71.0], [57.5, 71.0], [57.6, 71.0], [57.7, 71.0], [57.8, 71.0], [57.9, 71.0], [58.0, 71.0], [58.1, 71.0], [58.2, 71.0], [58.3, 72.0], [58.4, 72.0], [58.5, 72.0], [58.6, 72.0], [58.7, 72.0], [58.8, 72.0], [58.9, 72.0], [59.0, 72.0], [59.1, 72.0], [59.2, 72.0], [59.3, 72.0], [59.4, 73.0], [59.5, 73.0], [59.6, 73.0], [59.7, 73.0], [59.8, 73.0], [59.9, 73.0], [60.0, 73.0], [60.1, 73.0], [60.2, 73.0], [60.3, 73.0], [60.4, 73.0], [60.5, 74.0], [60.6, 74.0], [60.7, 74.0], [60.8, 74.0], [60.9, 74.0], [61.0, 74.0], [61.1, 74.0], [61.2, 74.0], [61.3, 74.0], [61.4, 74.0], [61.5, 74.0], [61.6, 75.0], [61.7, 75.0], [61.8, 75.0], [61.9, 75.0], [62.0, 75.0], [62.1, 75.0], [62.2, 75.0], [62.3, 75.0], [62.4, 75.0], [62.5, 75.0], [62.6, 75.0], [62.7, 76.0], [62.8, 76.0], [62.9, 76.0], [63.0, 76.0], [63.1, 76.0], [63.2, 76.0], [63.3, 76.0], [63.4, 76.0], [63.5, 76.0], [63.6, 76.0], [63.7, 77.0], [63.8, 77.0], [63.9, 77.0], [64.0, 77.0], [64.1, 77.0], [64.2, 77.0], [64.3, 77.0], [64.4, 77.0], [64.5, 77.0], [64.6, 77.0], [64.7, 78.0], [64.8, 78.0], [64.9, 78.0], [65.0, 78.0], [65.1, 78.0], [65.2, 78.0], [65.3, 78.0], [65.4, 78.0], [65.5, 78.0], [65.6, 78.0], [65.7, 79.0], [65.8, 79.0], [65.9, 79.0], [66.0, 79.0], [66.1, 79.0], [66.2, 79.0], [66.3, 79.0], [66.4, 79.0], [66.5, 79.0], [66.6, 79.0], [66.7, 80.0], [66.8, 80.0], [66.9, 80.0], [67.0, 80.0], [67.1, 80.0], [67.2, 80.0], [67.3, 80.0], [67.4, 80.0], [67.5, 80.0], [67.6, 80.0], [67.7, 81.0], [67.8, 81.0], [67.9, 81.0], [68.0, 81.0], [68.1, 81.0], [68.2, 81.0], [68.3, 81.0], [68.4, 81.0], [68.5, 81.0], [68.6, 81.0], [68.7, 82.0], [68.8, 82.0], [68.9, 82.0], [69.0, 82.0], [69.1, 82.0], [69.2, 82.0], [69.3, 82.0], [69.4, 82.0], [69.5, 82.0], [69.6, 82.0], [69.7, 83.0], [69.8, 83.0], [69.9, 83.0], [70.0, 83.0], [70.1, 83.0], [70.2, 83.0], [70.3, 83.0], [70.4, 83.0], [70.5, 83.0], [70.6, 84.0], [70.7, 84.0], [70.8, 84.0], [70.9, 84.0], [71.0, 84.0], [71.1, 84.0], [71.2, 84.0], [71.3, 84.0], [71.4, 84.0], [71.5, 85.0], [71.6, 85.0], [71.7, 85.0], [71.8, 85.0], [71.9, 85.0], [72.0, 85.0], [72.1, 85.0], [72.2, 85.0], [72.3, 85.0], [72.4, 86.0], [72.5, 86.0], [72.6, 86.0], [72.7, 86.0], [72.8, 86.0], [72.9, 86.0], [73.0, 86.0], [73.1, 86.0], [73.2, 86.0], [73.3, 87.0], [73.4, 87.0], [73.5, 87.0], [73.6, 87.0], [73.7, 87.0], [73.8, 87.0], [73.9, 87.0], [74.0, 87.0], [74.1, 87.0], [74.2, 88.0], [74.3, 88.0], [74.4, 88.0], [74.5, 88.0], [74.6, 88.0], [74.7, 88.0], [74.8, 88.0], [74.9, 88.0], [75.0, 89.0], [75.1, 89.0], [75.2, 89.0], [75.3, 89.0], [75.4, 89.0], [75.5, 89.0], [75.6, 89.0], [75.7, 89.0], [75.8, 90.0], [75.9, 90.0], [76.0, 90.0], [76.1, 90.0], [76.2, 90.0], [76.3, 90.0], [76.4, 90.0], [76.5, 90.0], [76.6, 90.0], [76.7, 91.0], [76.8, 91.0], [76.9, 91.0], [77.0, 91.0], [77.1, 91.0], [77.2, 91.0], [77.3, 91.0], [77.4, 91.0], [77.5, 92.0], [77.6, 92.0], [77.7, 92.0], [77.8, 92.0], [77.9, 92.0], [78.0, 92.0], [78.1, 92.0], [78.2, 93.0], [78.3, 93.0], [78.4, 93.0], [78.5, 93.0], [78.6, 93.0], [78.7, 93.0], [78.8, 93.0], [78.9, 94.0], [79.0, 94.0], [79.1, 94.0], [79.2, 94.0], [79.3, 94.0], [79.4, 94.0], [79.5, 94.0], [79.6, 94.0], [79.7, 95.0], [79.8, 95.0], [79.9, 95.0], [80.0, 95.0], [80.1, 95.0], [80.2, 95.0], [80.3, 95.0], [80.4, 96.0], [80.5, 96.0], [80.6, 96.0], [80.7, 96.0], [80.8, 96.0], [80.9, 96.0], [81.0, 96.0], [81.1, 97.0], [81.2, 97.0], [81.3, 97.0], [81.4, 97.0], [81.5, 97.0], [81.6, 97.0], [81.7, 97.0], [81.8, 98.0], [81.9, 98.0], [82.0, 98.0], [82.1, 98.0], [82.2, 98.0], [82.3, 98.0], [82.4, 99.0], [82.5, 99.0], [82.6, 99.0], [82.7, 99.0], [82.8, 99.0], [82.9, 99.0], [83.0, 100.0], [83.1, 100.0], [83.2, 100.0], [83.3, 100.0], [83.4, 100.0], [83.5, 100.0], [83.6, 101.0], [83.7, 101.0], [83.8, 101.0], [83.9, 101.0], [84.0, 101.0], [84.1, 101.0], [84.2, 102.0], [84.3, 102.0], [84.4, 102.0], [84.5, 102.0], [84.6, 102.0], [84.7, 102.0], [84.8, 103.0], [84.9, 103.0], [85.0, 103.0], [85.1, 103.0], [85.2, 103.0], [85.3, 103.0], [85.4, 104.0], [85.5, 104.0], [85.6, 104.0], [85.7, 104.0], [85.8, 104.0], [85.9, 104.0], [86.0, 105.0], [86.1, 105.0], [86.2, 105.0], [86.3, 105.0], [86.4, 105.0], [86.5, 106.0], [86.6, 106.0], [86.7, 106.0], [86.8, 106.0], [86.9, 106.0], [87.0, 107.0], [87.1, 107.0], [87.2, 107.0], [87.3, 107.0], [87.4, 107.0], [87.5, 108.0], [87.6, 108.0], [87.7, 108.0], [87.8, 108.0], [87.9, 108.0], [88.0, 109.0], [88.1, 109.0], [88.2, 109.0], [88.3, 109.0], [88.4, 109.0], [88.5, 110.0], [88.6, 110.0], [88.7, 110.0], [88.8, 110.0], [88.9, 110.0], [89.0, 111.0], [89.1, 111.0], [89.2, 111.0], [89.3, 111.0], [89.4, 112.0], [89.5, 112.0], [89.6, 112.0], [89.7, 112.0], [89.8, 113.0], [89.9, 113.0], [90.0, 113.0], [90.1, 113.0], [90.2, 113.0], [90.3, 114.0], [90.4, 114.0], [90.5, 114.0], [90.6, 115.0], [90.7, 115.0], [90.8, 115.0], [90.9, 115.0], [91.0, 116.0], [91.1, 116.0], [91.2, 116.0], [91.3, 116.0], [91.4, 117.0], [91.5, 117.0], [91.6, 117.0], [91.7, 117.0], [91.8, 118.0], [91.9, 118.0], [92.0, 118.0], [92.1, 119.0], [92.2, 119.0], [92.3, 119.0], [92.4, 119.0], [92.5, 120.0], [92.6, 120.0], [92.7, 120.0], [92.8, 121.0], [92.9, 121.0], [93.0, 121.0], [93.1, 122.0], [93.2, 122.0], [93.3, 122.0], [93.4, 123.0], [93.5, 123.0], [93.6, 123.0], [93.7, 124.0], [93.8, 124.0], [93.9, 124.0], [94.0, 125.0], [94.1, 125.0], [94.2, 126.0], [94.3, 126.0], [94.4, 126.0], [94.5, 127.0], [94.6, 127.0], [94.7, 128.0], [94.8, 128.0], [94.9, 128.0], [95.0, 129.0], [95.1, 129.0], [95.2, 130.0], [95.3, 130.0], [95.4, 131.0], [95.5, 131.0], [95.6, 132.0], [95.7, 132.0], [95.8, 133.0], [95.9, 133.0], [96.0, 134.0], [96.1, 134.0], [96.2, 135.0], [96.3, 136.0], [96.4, 136.0], [96.5, 137.0], [96.6, 137.0], [96.7, 138.0], [96.8, 139.0], [96.9, 139.0], [97.0, 140.0], [97.1, 141.0], [97.2, 141.0], [97.3, 142.0], [97.4, 143.0], [97.5, 144.0], [97.6, 145.0], [97.7, 145.0], [97.8, 146.0], [97.9, 147.0], [98.0, 148.0], [98.1, 149.0], [98.2, 150.0], [98.3, 152.0], [98.4, 153.0], [98.5, 154.0], [98.6, 155.0], [98.7, 157.0], [98.8, 159.0], [98.9, 160.0], [99.0, 162.0], [99.1, 164.0], [99.2, 167.0], [99.3, 169.0], [99.4, 172.0], [99.5, 176.0], [99.6, 180.0], [99.7, 185.0], [99.8, 193.0], [99.9, 208.0]], "isOverall": false, "label": "号源查询请求-优化", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 15.0, "minX": 0.0, "maxY": 400591.0, "series": [{"data": [[0.0, 400591.0], [300.0, 15.0], [100.0, 81537.0], [200.0, 693.0]], "isOverall": false, "label": "号源查询请求-优化", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 300.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 482836.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 482836.0, "series": [{"data": [[0.0, 482836.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 5.946485623003189, "minX": 1.77451062E12, "maxY": 200.0, "series": [{"data": [[1.7745108E12, 199.87028315128228], [1.77451068E12, 160.0147706158909], [1.77451074E12, 200.0], [1.77451062E12, 5.946485623003189]], "isOverall": false, "label": "号源查询", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745108E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 3.0000000000000013, "minX": 1.0, "maxY": 74.74093264248707, "series": [{"data": [[2.0, 3.0000000000000013], [3.0, 4.423076923076923], [4.0, 3.4269662921348307], [5.0, 3.1428571428571437], [6.0, 5.105590062111801], [7.0, 10.040000000000003], [8.0, 10.675675675675674], [9.0, 10.768595041322312], [10.0, 17.344086021505372], [11.0, 14.728813559322035], [12.0, 12.669117647058822], [13.0, 15.203124999999996], [14.0, 16.07246376811594], [15.0, 11.202020202020199], [16.0, 7.6603174603174615], [17.0, 6.934472934472939], [18.0, 10.599277978339346], [19.0, 10.864661654135343], [20.0, 10.39041095890411], [21.0, 11.165413533834586], [22.0, 7.645833333333332], [23.0, 62.5], [24.0, 9.000000000000004], [25.0, 11.305135951661628], [26.0, 10.84285714285714], [27.0, 10.131188118811888], [28.0, 12.124629080118703], [29.0, 14.494983277591967], [30.0, 15.948805460750847], [31.0, 13.439790575916225], [32.0, 15.70491803278688], [33.0, 15.022292993630566], [34.0, 14.78284182305629], [35.0, 16.55782312925169], [36.0, 19.966165413533837], [37.0, 13.756038647342985], [38.0, 14.075949367088608], [39.0, 20.3667820069204], [40.0, 19.283333333333353], [41.0, 18.61656441717792], [42.0, 28.49537037037038], [43.0, 30.83009708737866], [44.0, 28.282051282051277], [45.0, 19.79310344827584], [46.0, 24.67518248175181], [47.0, 22.749999999999993], [48.0, 20.23262032085561], [49.0, 22.808917197452246], [50.0, 28.01498127340824], [51.0, 22.712166172106826], [52.0, 19.088516746411475], [53.0, 20.85185185185186], [54.0, 21.215633423180616], [55.0, 20.56234096692113], [56.0, 20.13075060532685], [57.0, 21.89974937343358], [58.0, 23.307901907356943], [59.0, 20.07142857142856], [60.0, 20.43790849673203], [61.0, 22.817460317460313], [62.0, 22.600938967136162], [63.0, 23.875324675324688], [64.0, 23.203517587939697], [65.0, 25.900255754475715], [66.0, 23.108597285067876], [67.0, 23.837962962962973], [68.0, 24.421319796954315], [69.0, 25.90384615384613], [70.0, 24.481481481481485], [71.0, 25.613908872901668], [72.0, 28.222222222222232], [73.0, 26.224537037037024], [74.0, 25.614155251141533], [75.0, 28.427835051546392], [76.0, 26.201877934272307], [77.0, 27.889423076923077], [78.0, 28.152849740932652], [79.0, 28.913439635535305], [80.0, 28.136890951276094], [81.0, 26.60047281323877], [82.0, 30.922885572139307], [83.0, 30.002386634844854], [84.0, 28.630136986301366], [85.0, 30.532499999999988], [86.0, 30.352402745995413], [87.0, 31.19854721549639], [88.0, 30.047619047619023], [89.0, 33.79746835443039], [90.0, 32.720698254364045], [91.0, 31.897494305239167], [92.0, 33.10997442455243], [93.0, 35.036407766990315], [94.0, 33.284360189573455], [95.0, 31.391498881431776], [96.0, 36.966321243523346], [97.0, 34.94186046511624], [98.0, 33.97571743929361], [99.0, 37.380952380952365], [100.0, 39.34031413612565], [101.0, 47.932038834951484], [102.0, 35.148401826484005], [103.0, 39.52590673575134], [104.0, 38.1196172248804], [105.0, 35.29166666666668], [106.0, 41.327225130890085], [107.0, 50.136363636363626], [108.0, 43.761273209549046], [109.0, 59.06909090909094], [110.0, 46.869436201780424], [111.0, 44.13170731707317], [112.0, 37.41418764302063], [113.0, 40.36450839328535], [114.0, 44.90862944162434], [115.0, 41.44075829383885], [116.0, 39.69976905311777], [117.0, 44.651226158038156], [118.0, 42.82435597189695], [119.0, 38.76483516483518], [120.0, 43.89526184538654], [121.0, 45.37002341920376], [122.0, 42.73086419753089], [123.0, 45.14214463840398], [124.0, 43.926650366748156], [125.0, 45.162100456621026], [126.0, 42.54312354312351], [127.0, 45.68599033816427], [128.0, 46.630806845965765], [129.0, 45.036057692307686], [130.0, 48.662679425837304], [131.0, 47.65248226950353], [132.0, 47.435096153846175], [133.0, 44.89655172413794], [134.0, 48.47088607594933], [135.0, 49.39770114942526], [136.0, 46.840686274509814], [137.0, 52.57721518987337], [138.0, 48.65375854214122], [139.0, 51.85294117647059], [140.0, 45.91422121896162], [141.0, 52.41911764705884], [142.0, 53.81564245810055], [143.0, 54.968058968058926], [144.0, 54.023752969121134], [145.0, 53.33417721518984], [146.0, 51.20884520884522], [147.0, 48.688172043010766], [148.0, 55.75128205128206], [149.0, 56.3969849246231], [150.0, 56.77192982456139], [151.0, 51.25165562913904], [152.0, 51.32790697674416], [153.0, 55.91022443890274], [154.0, 52.48780487804878], [155.0, 56.798543689320404], [156.0, 55.31443298969073], [157.0, 57.821428571428626], [158.0, 50.417452830188665], [159.0, 54.0210970464135], [160.0, 58.36473429951687], [161.0, 54.56872037914688], [162.0, 58.29999999999996], [163.0, 63.54936708860759], [164.0, 59.93939393939393], [165.0, 59.16467780429596], [166.0, 57.233082706766915], [167.0, 59.83047210300434], [168.0, 59.403846153846146], [169.0, 60.449172576832105], [170.0, 64.87222222222222], [171.0, 62.41929133858269], [172.0, 58.86991869918699], [173.0, 58.25663716814163], [174.0, 63.874035989717235], [175.0, 55.20479302832244], [176.0, 63.301047120418936], [177.0, 74.74093264248707], [178.0, 62.79294117647058], [179.0, 60.293333333333294], [180.0, 60.033632286995505], [181.0, 64.90284360189575], [182.0, 63.08780487804878], [183.0, 64.90953545232276], [184.0, 68.90769230769234], [185.0, 70.33333333333343], [186.0, 59.892344497607645], [187.0, 67.31390134529155], [188.0, 69.2227848101266], [189.0, 65.1401869158878], [190.0, 71.7789203084833], [191.0, 67.07110091743115], [192.0, 69.42014742014744], [193.0, 70.59584295612005], [194.0, 66.08137044967886], [195.0, 68.45169712793734], [196.0, 69.14712643678156], [197.0, 70.92768079800497], [198.0, 72.87906976744189], [199.0, 72.11666666666663], [200.0, 72.82491798148621], [1.0, 8.0]], "isOverall": false, "label": "号源查询请求-优化", "isController": false}, {"data": [[186.17165662875564, 67.85314268198708]], "isOverall": false, "label": "号源查询请求-优化-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 200.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 7219.866666666667, "minX": 1.77451062E12, "maxY": 4.241950168333333E7, "series": [{"data": [[1.7745108E12, 4.226690278333333E7], [1.77451068E12, 4.2285050666666664E7], [1.77451074E12, 4.241950168333333E7], [1.77451062E12, 326990.18333333335]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7745108E12, 924413.9666666667], [1.77451068E12, 924892.6], [1.77451074E12, 927827.8333333334], [1.77451062E12, 7219.866666666667]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745108E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 6.703674121405756, "minX": 1.77451062E12, "maxY": 73.65099599117313, "series": [{"data": [[1.7745108E12, 72.43245603638012], [1.77451068E12, 57.937288790792266], [1.77451074E12, 73.65099599117313], [1.77451062E12, 6.703674121405756]], "isOverall": false, "label": "号源查询请求-优化", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745108E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 6.488019169329072, "minX": 1.77451062E12, "maxY": 65.32120326921229, "series": [{"data": [[1.7745108E12, 64.25653294074549], [1.77451068E12, 51.64206975671149], [1.77451074E12, 65.32120326921229], [1.77451062E12, 6.488019169329072]], "isOverall": false, "label": "号源查询请求-优化", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745108E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 6.862005077883767E-4, "minX": 1.77451062E12, "maxY": 0.019968051118210855, "series": [{"data": [[1.7745108E12, 6.862005077883767E-4], [1.77451068E12, 9.352437245145925E-4], [1.77451074E12, 8.57702228161226E-4], [1.77451062E12, 0.019968051118210855]], "isOverall": false, "label": "号源查询请求-优化", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745108E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.77451062E12, "maxY": 349.0, "series": [{"data": [[1.7745108E12, 343.0], [1.77451068E12, 349.0], [1.77451074E12, 342.0], [1.77451062E12, 39.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7745108E12, 121.0], [1.77451068E12, 114.0], [1.77451074E12, 114.0], [1.77451062E12, 14.700000000000045]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7745108E12, 174.0], [1.77451068E12, 157.0], [1.77451074E12, 157.9900000000016], [1.77451062E12, 26.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7745108E12, 138.0], [1.77451068E12, 128.0], [1.77451074E12, 128.0], [1.77451062E12, 19.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.7745108E12, 2.0], [1.77451068E12, 2.0], [1.77451074E12, 2.0], [1.77451062E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7745108E12, 66.0], [1.77451068E12, 70.0], [1.77451074E12, 70.0], [1.77451062E12, 4.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745108E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 3.0, "minX": 362.0, "maxY": 88.0, "series": [{"data": [[362.0, 3.0], [890.0, 6.0], [1233.0, 62.0], [1361.0, 9.0], [1440.0, 9.0], [1840.0, 20.0], [2103.0, 21.0], [2059.0, 61.0], [2163.0, 72.0], [2172.0, 64.0], [2265.0, 11.0], [2231.0, 14.0], [2203.0, 88.0], [2354.0, 42.0], [2416.0, 79.0], [2402.0, 78.0], [2376.0, 80.0], [2483.0, 73.0], [2519.0, 77.0], [2522.0, 73.0], [2447.0, 75.0], [2510.0, 77.0], [2482.0, 67.0], [2527.0, 74.0], [2529.0, 71.0], [2676.0, 71.0], [2628.0, 73.0], [2606.0, 19.0], [2630.0, 37.0], [2635.0, 72.0], [2648.0, 71.0], [2652.0, 72.0], [2649.0, 72.0], [2677.0, 72.0], [2686.0, 74.0], [2682.0, 70.0], [2678.0, 72.0], [2604.0, 73.0], [2603.0, 69.0], [2673.0, 72.0], [2656.0, 73.0], [2612.0, 74.0], [2578.0, 71.0], [2581.0, 72.0], [2670.0, 72.0], [2793.0, 42.0], [2815.0, 28.0], [2733.0, 33.0], [2734.0, 70.0], [2727.0, 69.0], [2731.0, 71.0], [2723.0, 70.0], [2724.0, 68.0], [2725.0, 71.0], [2777.0, 43.0], [2770.0, 62.0], [2773.0, 68.0], [2772.0, 66.0], [2771.0, 69.0], [2737.0, 25.0], [2788.0, 54.0], [2789.0, 67.0], [2792.0, 67.0], [2705.0, 49.0], [2707.0, 70.0], [2706.0, 67.0], [2699.0, 70.0], [2740.0, 66.0], [2745.0, 69.0], [2748.0, 66.0], [2747.0, 68.0], [2695.0, 70.0], [2787.0, 68.0], [2786.0, 69.0], [2711.0, 71.0], [2715.0, 71.0], [2719.0, 71.0], [2784.0, 66.0], [2718.0, 71.0], [2716.0, 70.0], [2708.0, 70.0], [2769.0, 43.0], [2757.0, 39.0], [2762.0, 68.0], [2760.0, 68.0], [2754.0, 70.0], [2753.0, 69.0], [2755.0, 69.0], [2766.0, 50.0], [2768.0, 67.0], [2764.0, 69.0], [2763.0, 68.0], [2800.0, 43.0], [2813.0, 64.0], [2812.0, 67.0], [2811.0, 68.0], [2805.0, 68.0], [2801.0, 67.0], [2810.0, 68.0], [2808.0, 68.5], [2809.0, 67.0], [2807.0, 68.0], [2795.0, 63.0], [2794.0, 65.5], [2798.0, 67.0], [2799.0, 66.0], [2797.0, 68.0], [2796.0, 68.0], [2782.0, 54.0], [2780.0, 69.0], [2825.0, 68.0], [2857.0, 50.0], [2871.0, 69.0], [2818.0, 68.0], [2817.0, 67.0], [2836.0, 66.0], [2847.0, 67.0], [2844.0, 66.0], [2846.0, 66.0], [2828.0, 67.0], [2827.0, 70.0], [2832.0, 68.0], [2831.0, 68.0], [2850.0, 68.0], [2851.0, 69.0], [2820.0, 68.0], [2824.0, 68.0], [2822.0, 64.5], [2840.0, 66.5], [2842.0, 69.0], [2838.0, 69.0], [2843.0, 68.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 2871.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 3.0, "minX": 362.0, "maxY": 78.0, "series": [{"data": [[362.0, 3.0], [890.0, 6.0], [1233.0, 57.0], [1361.0, 8.0], [1440.0, 9.0], [1840.0, 18.0], [2103.0, 20.0], [2059.0, 55.0], [2163.0, 64.0], [2172.0, 57.0], [2265.0, 10.0], [2231.0, 13.0], [2203.0, 78.0], [2354.0, 38.0], [2416.0, 69.0], [2402.0, 68.0], [2376.0, 71.0], [2483.0, 65.0], [2519.0, 68.0], [2522.0, 65.0], [2447.0, 66.0], [2510.0, 68.0], [2482.0, 59.0], [2527.0, 64.0], [2529.0, 63.0], [2676.0, 64.0], [2628.0, 64.0], [2606.0, 18.0], [2630.0, 33.0], [2635.0, 64.0], [2648.0, 63.0], [2652.0, 63.0], [2649.0, 64.0], [2677.0, 64.0], [2686.0, 64.0], [2682.0, 62.0], [2678.0, 64.0], [2604.0, 65.0], [2603.0, 61.0], [2673.0, 64.0], [2656.0, 64.0], [2612.0, 65.0], [2578.0, 63.0], [2581.0, 64.0], [2670.0, 63.0], [2793.0, 37.0], [2815.0, 25.0], [2733.0, 30.0], [2734.0, 61.0], [2727.0, 61.0], [2731.0, 63.0], [2723.0, 62.0], [2724.0, 60.0], [2725.0, 63.0], [2777.0, 39.0], [2770.0, 55.0], [2773.0, 60.0], [2772.0, 59.0], [2771.0, 60.0], [2737.0, 23.0], [2788.0, 49.0], [2789.0, 59.0], [2792.0, 60.0], [2705.0, 43.0], [2707.0, 62.0], [2706.0, 61.0], [2699.0, 63.0], [2740.0, 59.0], [2745.0, 62.0], [2748.0, 58.5], [2747.0, 61.0], [2695.0, 62.0], [2787.0, 60.0], [2786.0, 61.5], [2711.0, 63.0], [2715.0, 63.0], [2719.0, 63.0], [2784.0, 60.0], [2718.0, 63.0], [2716.0, 62.0], [2708.0, 62.0], [2769.0, 38.0], [2757.0, 35.0], [2762.0, 61.0], [2760.0, 60.0], [2754.0, 61.0], [2753.0, 62.0], [2755.0, 62.0], [2766.0, 45.0], [2768.0, 60.0], [2764.0, 61.0], [2763.0, 61.0], [2800.0, 39.0], [2813.0, 57.0], [2812.0, 60.0], [2811.0, 60.0], [2805.0, 61.0], [2801.0, 59.0], [2810.0, 59.0], [2808.0, 61.0], [2809.0, 60.0], [2807.0, 61.0], [2795.0, 56.0], [2794.0, 58.0], [2798.0, 59.0], [2799.0, 59.0], [2797.0, 60.0], [2796.0, 60.0], [2782.0, 48.0], [2780.0, 61.0], [2825.0, 60.0], [2857.0, 45.0], [2871.0, 60.0], [2818.0, 60.0], [2817.0, 58.0], [2836.0, 58.0], [2847.0, 60.0], [2844.0, 58.0], [2846.0, 59.0], [2828.0, 60.0], [2827.0, 61.0], [2832.0, 61.0], [2831.0, 60.0], [2850.0, 60.0], [2851.0, 61.0], [2820.0, 60.0], [2824.0, 60.0], [2822.0, 58.0], [2840.0, 58.0], [2842.0, 61.0], [2838.0, 62.0], [2843.0, 60.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 2871.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 21.05, "minX": 1.77451062E12, "maxY": 2681.5833333333335, "series": [{"data": [[1.7745108E12, 2668.383333333333], [1.77451068E12, 2676.25], [1.77451074E12, 2681.5833333333335], [1.77451062E12, 21.05]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745108E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 20.866666666666667, "minX": 1.77451062E12, "maxY": 2681.5833333333335, "series": [{"data": [[1.7745108E12, 2671.7166666666667], [1.77451068E12, 2673.1], [1.77451074E12, 2681.5833333333335], [1.77451062E12, 20.866666666666667]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7745108E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 20.866666666666667, "minX": 1.77451062E12, "maxY": 2681.5833333333335, "series": [{"data": [[1.7745108E12, 2671.7166666666667], [1.77451068E12, 2673.1], [1.77451074E12, 2681.5833333333335], [1.77451062E12, 20.866666666666667]], "isOverall": false, "label": "号源查询请求-优化-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745108E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 20.866666666666667, "minX": 1.77451062E12, "maxY": 2681.5833333333335, "series": [{"data": [[1.7745108E12, 2671.7166666666667], [1.77451068E12, 2673.1], [1.77451074E12, 2681.5833333333335], [1.77451062E12, 20.866666666666667]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7745108E12, "title": "Total Transactions Per Second"}},
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

