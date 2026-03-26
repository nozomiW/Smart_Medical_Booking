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
        data: {"result": {"minY": 2.0, "minX": 0.0, "maxY": 839.0, "series": [{"data": [[0.0, 2.0], [0.1, 4.0], [0.2, 5.0], [0.3, 6.0], [0.4, 6.0], [0.5, 7.0], [0.6, 7.0], [0.7, 8.0], [0.8, 8.0], [0.9, 8.0], [1.0, 9.0], [1.1, 9.0], [1.2, 9.0], [1.3, 9.0], [1.4, 10.0], [1.5, 10.0], [1.6, 10.0], [1.7, 10.0], [1.8, 10.0], [1.9, 11.0], [2.0, 11.0], [2.1, 11.0], [2.2, 11.0], [2.3, 11.0], [2.4, 11.0], [2.5, 12.0], [2.6, 12.0], [2.7, 12.0], [2.8, 12.0], [2.9, 12.0], [3.0, 12.0], [3.1, 12.0], [3.2, 12.0], [3.3, 13.0], [3.4, 13.0], [3.5, 13.0], [3.6, 13.0], [3.7, 13.0], [3.8, 13.0], [3.9, 13.0], [4.0, 13.0], [4.1, 14.0], [4.2, 14.0], [4.3, 14.0], [4.4, 14.0], [4.5, 14.0], [4.6, 14.0], [4.7, 14.0], [4.8, 14.0], [4.9, 14.0], [5.0, 15.0], [5.1, 15.0], [5.2, 15.0], [5.3, 15.0], [5.4, 15.0], [5.5, 15.0], [5.6, 15.0], [5.7, 15.0], [5.8, 15.0], [5.9, 15.0], [6.0, 16.0], [6.1, 16.0], [6.2, 16.0], [6.3, 16.0], [6.4, 16.0], [6.5, 16.0], [6.6, 16.0], [6.7, 16.0], [6.8, 16.0], [6.9, 16.0], [7.0, 16.0], [7.1, 17.0], [7.2, 17.0], [7.3, 17.0], [7.4, 17.0], [7.5, 17.0], [7.6, 17.0], [7.7, 17.0], [7.8, 17.0], [7.9, 17.0], [8.0, 17.0], [8.1, 17.0], [8.2, 17.0], [8.3, 18.0], [8.4, 18.0], [8.5, 18.0], [8.6, 18.0], [8.7, 18.0], [8.8, 18.0], [8.9, 18.0], [9.0, 18.0], [9.1, 18.0], [9.2, 18.0], [9.3, 18.0], [9.4, 19.0], [9.5, 19.0], [9.6, 19.0], [9.7, 19.0], [9.8, 19.0], [9.9, 19.0], [10.0, 19.0], [10.1, 19.0], [10.2, 19.0], [10.3, 19.0], [10.4, 19.0], [10.5, 19.0], [10.6, 20.0], [10.7, 20.0], [10.8, 20.0], [10.9, 20.0], [11.0, 20.0], [11.1, 20.0], [11.2, 20.0], [11.3, 20.0], [11.4, 20.0], [11.5, 20.0], [11.6, 20.0], [11.7, 21.0], [11.8, 21.0], [11.9, 21.0], [12.0, 21.0], [12.1, 21.0], [12.2, 21.0], [12.3, 21.0], [12.4, 21.0], [12.5, 21.0], [12.6, 21.0], [12.7, 21.0], [12.8, 21.0], [12.9, 22.0], [13.0, 22.0], [13.1, 22.0], [13.2, 22.0], [13.3, 22.0], [13.4, 22.0], [13.5, 22.0], [13.6, 22.0], [13.7, 22.0], [13.8, 22.0], [13.9, 22.0], [14.0, 23.0], [14.1, 23.0], [14.2, 23.0], [14.3, 23.0], [14.4, 23.0], [14.5, 23.0], [14.6, 23.0], [14.7, 23.0], [14.8, 23.0], [14.9, 23.0], [15.0, 24.0], [15.1, 24.0], [15.2, 24.0], [15.3, 24.0], [15.4, 24.0], [15.5, 24.0], [15.6, 24.0], [15.7, 24.0], [15.8, 24.0], [15.9, 24.0], [16.0, 25.0], [16.1, 25.0], [16.2, 25.0], [16.3, 25.0], [16.4, 25.0], [16.5, 25.0], [16.6, 25.0], [16.7, 25.0], [16.8, 25.0], [16.9, 25.0], [17.0, 26.0], [17.1, 26.0], [17.2, 26.0], [17.3, 26.0], [17.4, 26.0], [17.5, 26.0], [17.6, 26.0], [17.7, 26.0], [17.8, 26.0], [17.9, 27.0], [18.0, 27.0], [18.1, 27.0], [18.2, 27.0], [18.3, 27.0], [18.4, 27.0], [18.5, 27.0], [18.6, 27.0], [18.7, 28.0], [18.8, 28.0], [18.9, 28.0], [19.0, 28.0], [19.1, 28.0], [19.2, 28.0], [19.3, 28.0], [19.4, 28.0], [19.5, 29.0], [19.6, 29.0], [19.7, 29.0], [19.8, 29.0], [19.9, 29.0], [20.0, 29.0], [20.1, 29.0], [20.2, 30.0], [20.3, 30.0], [20.4, 30.0], [20.5, 30.0], [20.6, 30.0], [20.7, 30.0], [20.8, 30.0], [20.9, 31.0], [21.0, 31.0], [21.1, 31.0], [21.2, 31.0], [21.3, 31.0], [21.4, 31.0], [21.5, 32.0], [21.6, 32.0], [21.7, 32.0], [21.8, 32.0], [21.9, 32.0], [22.0, 32.0], [22.1, 33.0], [22.2, 33.0], [22.3, 33.0], [22.4, 33.0], [22.5, 33.0], [22.6, 34.0], [22.7, 34.0], [22.8, 34.0], [22.9, 34.0], [23.0, 34.0], [23.1, 35.0], [23.2, 35.0], [23.3, 35.0], [23.4, 35.0], [23.5, 36.0], [23.6, 36.0], [23.7, 36.0], [23.8, 36.0], [23.9, 36.0], [24.0, 37.0], [24.1, 37.0], [24.2, 37.0], [24.3, 37.0], [24.4, 38.0], [24.5, 38.0], [24.6, 38.0], [24.7, 39.0], [24.8, 39.0], [24.9, 39.0], [25.0, 39.0], [25.1, 40.0], [25.2, 40.0], [25.3, 40.0], [25.4, 41.0], [25.5, 41.0], [25.6, 41.0], [25.7, 42.0], [25.8, 42.0], [25.9, 42.0], [26.0, 43.0], [26.1, 43.0], [26.2, 43.0], [26.3, 44.0], [26.4, 44.0], [26.5, 45.0], [26.6, 45.0], [26.7, 45.0], [26.8, 46.0], [26.9, 46.0], [27.0, 47.0], [27.1, 47.0], [27.2, 48.0], [27.3, 48.0], [27.4, 49.0], [27.5, 49.0], [27.6, 50.0], [27.7, 50.0], [27.8, 51.0], [27.9, 51.0], [28.0, 52.0], [28.1, 52.0], [28.2, 53.0], [28.3, 54.0], [28.4, 54.0], [28.5, 55.0], [28.6, 56.0], [28.7, 56.0], [28.8, 57.0], [28.9, 58.0], [29.0, 58.0], [29.1, 59.0], [29.2, 60.0], [29.3, 61.0], [29.4, 62.0], [29.5, 63.0], [29.6, 63.0], [29.7, 64.0], [29.8, 65.0], [29.9, 66.0], [30.0, 67.0], [30.1, 68.0], [30.2, 68.0], [30.3, 69.0], [30.4, 70.0], [30.5, 71.0], [30.6, 72.0], [30.7, 73.0], [30.8, 73.0], [30.9, 74.0], [31.0, 75.0], [31.1, 76.0], [31.2, 77.0], [31.3, 78.0], [31.4, 79.0], [31.5, 80.0], [31.6, 81.0], [31.7, 82.0], [31.8, 83.0], [31.9, 84.0], [32.0, 84.0], [32.1, 85.0], [32.2, 86.0], [32.3, 87.0], [32.4, 88.0], [32.5, 89.0], [32.6, 90.0], [32.7, 90.0], [32.8, 91.0], [32.9, 92.0], [33.0, 93.0], [33.1, 94.0], [33.2, 95.0], [33.3, 95.0], [33.4, 96.0], [33.5, 97.0], [33.6, 98.0], [33.7, 99.0], [33.8, 99.0], [33.9, 100.0], [34.0, 101.0], [34.1, 102.0], [34.2, 102.0], [34.3, 103.0], [34.4, 104.0], [34.5, 105.0], [34.6, 105.0], [34.7, 106.0], [34.8, 106.0], [34.9, 107.0], [35.0, 108.0], [35.1, 108.0], [35.2, 109.0], [35.3, 109.0], [35.4, 109.0], [35.5, 110.0], [35.6, 110.0], [35.7, 111.0], [35.8, 111.0], [35.9, 111.0], [36.0, 112.0], [36.1, 112.0], [36.2, 112.0], [36.3, 113.0], [36.4, 113.0], [36.5, 113.0], [36.6, 113.0], [36.7, 114.0], [36.8, 114.0], [36.9, 114.0], [37.0, 114.0], [37.1, 114.0], [37.2, 115.0], [37.3, 115.0], [37.4, 115.0], [37.5, 115.0], [37.6, 115.0], [37.7, 116.0], [37.8, 116.0], [37.9, 116.0], [38.0, 116.0], [38.1, 116.0], [38.2, 116.0], [38.3, 117.0], [38.4, 117.0], [38.5, 117.0], [38.6, 117.0], [38.7, 117.0], [38.8, 117.0], [38.9, 117.0], [39.0, 118.0], [39.1, 118.0], [39.2, 118.0], [39.3, 118.0], [39.4, 118.0], [39.5, 118.0], [39.6, 118.0], [39.7, 118.0], [39.8, 119.0], [39.9, 119.0], [40.0, 119.0], [40.1, 119.0], [40.2, 119.0], [40.3, 119.0], [40.4, 119.0], [40.5, 119.0], [40.6, 119.0], [40.7, 120.0], [40.8, 120.0], [40.9, 120.0], [41.0, 120.0], [41.1, 120.0], [41.2, 120.0], [41.3, 120.0], [41.4, 120.0], [41.5, 120.0], [41.6, 120.0], [41.7, 121.0], [41.8, 121.0], [41.9, 121.0], [42.0, 121.0], [42.1, 121.0], [42.2, 121.0], [42.3, 121.0], [42.4, 121.0], [42.5, 121.0], [42.6, 121.0], [42.7, 121.0], [42.8, 121.0], [42.9, 122.0], [43.0, 122.0], [43.1, 122.0], [43.2, 122.0], [43.3, 122.0], [43.4, 122.0], [43.5, 122.0], [43.6, 122.0], [43.7, 122.0], [43.8, 122.0], [43.9, 122.0], [44.0, 122.0], [44.1, 123.0], [44.2, 123.0], [44.3, 123.0], [44.4, 123.0], [44.5, 123.0], [44.6, 123.0], [44.7, 123.0], [44.8, 123.0], [44.9, 123.0], [45.0, 123.0], [45.1, 123.0], [45.2, 123.0], [45.3, 123.0], [45.4, 124.0], [45.5, 124.0], [45.6, 124.0], [45.7, 124.0], [45.8, 124.0], [45.9, 124.0], [46.0, 124.0], [46.1, 124.0], [46.2, 124.0], [46.3, 124.0], [46.4, 124.0], [46.5, 124.0], [46.6, 124.0], [46.7, 124.0], [46.8, 125.0], [46.9, 125.0], [47.0, 125.0], [47.1, 125.0], [47.2, 125.0], [47.3, 125.0], [47.4, 125.0], [47.5, 125.0], [47.6, 125.0], [47.7, 125.0], [47.8, 125.0], [47.9, 125.0], [48.0, 125.0], [48.1, 125.0], [48.2, 125.0], [48.3, 126.0], [48.4, 126.0], [48.5, 126.0], [48.6, 126.0], [48.7, 126.0], [48.8, 126.0], [48.9, 126.0], [49.0, 126.0], [49.1, 126.0], [49.2, 126.0], [49.3, 126.0], [49.4, 126.0], [49.5, 126.0], [49.6, 126.0], [49.7, 126.0], [49.8, 127.0], [49.9, 127.0], [50.0, 127.0], [50.1, 127.0], [50.2, 127.0], [50.3, 127.0], [50.4, 127.0], [50.5, 127.0], [50.6, 127.0], [50.7, 127.0], [50.8, 127.0], [50.9, 127.0], [51.0, 127.0], [51.1, 127.0], [51.2, 127.0], [51.3, 127.0], [51.4, 128.0], [51.5, 128.0], [51.6, 128.0], [51.7, 128.0], [51.8, 128.0], [51.9, 128.0], [52.0, 128.0], [52.1, 128.0], [52.2, 128.0], [52.3, 128.0], [52.4, 128.0], [52.5, 128.0], [52.6, 128.0], [52.7, 128.0], [52.8, 128.0], [52.9, 129.0], [53.0, 129.0], [53.1, 129.0], [53.2, 129.0], [53.3, 129.0], [53.4, 129.0], [53.5, 129.0], [53.6, 129.0], [53.7, 129.0], [53.8, 129.0], [53.9, 129.0], [54.0, 129.0], [54.1, 129.0], [54.2, 129.0], [54.3, 129.0], [54.4, 129.0], [54.5, 129.0], [54.6, 130.0], [54.7, 130.0], [54.8, 130.0], [54.9, 130.0], [55.0, 130.0], [55.1, 130.0], [55.2, 130.0], [55.3, 130.0], [55.4, 130.0], [55.5, 130.0], [55.6, 130.0], [55.7, 130.0], [55.8, 130.0], [55.9, 130.0], [56.0, 130.0], [56.1, 130.0], [56.2, 131.0], [56.3, 131.0], [56.4, 131.0], [56.5, 131.0], [56.6, 131.0], [56.7, 131.0], [56.8, 131.0], [56.9, 131.0], [57.0, 131.0], [57.1, 131.0], [57.2, 131.0], [57.3, 131.0], [57.4, 131.0], [57.5, 131.0], [57.6, 131.0], [57.7, 131.0], [57.8, 132.0], [57.9, 132.0], [58.0, 132.0], [58.1, 132.0], [58.2, 132.0], [58.3, 132.0], [58.4, 132.0], [58.5, 132.0], [58.6, 132.0], [58.7, 132.0], [58.8, 132.0], [58.9, 132.0], [59.0, 132.0], [59.1, 132.0], [59.2, 132.0], [59.3, 133.0], [59.4, 133.0], [59.5, 133.0], [59.6, 133.0], [59.7, 133.0], [59.8, 133.0], [59.9, 133.0], [60.0, 133.0], [60.1, 133.0], [60.2, 133.0], [60.3, 133.0], [60.4, 133.0], [60.5, 133.0], [60.6, 133.0], [60.7, 133.0], [60.8, 134.0], [60.9, 134.0], [61.0, 134.0], [61.1, 134.0], [61.2, 134.0], [61.3, 134.0], [61.4, 134.0], [61.5, 134.0], [61.6, 134.0], [61.7, 134.0], [61.8, 134.0], [61.9, 134.0], [62.0, 134.0], [62.1, 134.0], [62.2, 135.0], [62.3, 135.0], [62.4, 135.0], [62.5, 135.0], [62.6, 135.0], [62.7, 135.0], [62.8, 135.0], [62.9, 135.0], [63.0, 135.0], [63.1, 135.0], [63.2, 135.0], [63.3, 135.0], [63.4, 135.0], [63.5, 136.0], [63.6, 136.0], [63.7, 136.0], [63.8, 136.0], [63.9, 136.0], [64.0, 136.0], [64.1, 136.0], [64.2, 136.0], [64.3, 136.0], [64.4, 136.0], [64.5, 136.0], [64.6, 136.0], [64.7, 136.0], [64.8, 137.0], [64.9, 137.0], [65.0, 137.0], [65.1, 137.0], [65.2, 137.0], [65.3, 137.0], [65.4, 137.0], [65.5, 137.0], [65.6, 137.0], [65.7, 137.0], [65.8, 137.0], [65.9, 137.0], [66.0, 138.0], [66.1, 138.0], [66.2, 138.0], [66.3, 138.0], [66.4, 138.0], [66.5, 138.0], [66.6, 138.0], [66.7, 138.0], [66.8, 138.0], [66.9, 138.0], [67.0, 138.0], [67.1, 139.0], [67.2, 139.0], [67.3, 139.0], [67.4, 139.0], [67.5, 139.0], [67.6, 139.0], [67.7, 139.0], [67.8, 139.0], [67.9, 139.0], [68.0, 139.0], [68.1, 140.0], [68.2, 140.0], [68.3, 140.0], [68.4, 140.0], [68.5, 140.0], [68.6, 140.0], [68.7, 140.0], [68.8, 140.0], [68.9, 140.0], [69.0, 140.0], [69.1, 141.0], [69.2, 141.0], [69.3, 141.0], [69.4, 141.0], [69.5, 141.0], [69.6, 141.0], [69.7, 141.0], [69.8, 141.0], [69.9, 141.0], [70.0, 142.0], [70.1, 142.0], [70.2, 142.0], [70.3, 142.0], [70.4, 142.0], [70.5, 142.0], [70.6, 142.0], [70.7, 142.0], [70.8, 143.0], [70.9, 143.0], [71.0, 143.0], [71.1, 143.0], [71.2, 143.0], [71.3, 143.0], [71.4, 143.0], [71.5, 144.0], [71.6, 144.0], [71.7, 144.0], [71.8, 144.0], [71.9, 144.0], [72.0, 144.0], [72.1, 145.0], [72.2, 145.0], [72.3, 145.0], [72.4, 145.0], [72.5, 145.0], [72.6, 145.0], [72.7, 145.0], [72.8, 146.0], [72.9, 146.0], [73.0, 146.0], [73.1, 146.0], [73.2, 146.0], [73.3, 147.0], [73.4, 147.0], [73.5, 147.0], [73.6, 147.0], [73.7, 147.0], [73.8, 148.0], [73.9, 148.0], [74.0, 148.0], [74.1, 148.0], [74.2, 148.0], [74.3, 149.0], [74.4, 149.0], [74.5, 149.0], [74.6, 149.0], [74.7, 150.0], [74.8, 150.0], [74.9, 150.0], [75.0, 150.0], [75.1, 151.0], [75.2, 151.0], [75.3, 151.0], [75.4, 151.0], [75.5, 152.0], [75.6, 152.0], [75.7, 152.0], [75.8, 153.0], [75.9, 153.0], [76.0, 153.0], [76.1, 154.0], [76.2, 154.0], [76.3, 155.0], [76.4, 155.0], [76.5, 155.0], [76.6, 156.0], [76.7, 156.0], [76.8, 157.0], [76.9, 157.0], [77.0, 158.0], [77.1, 158.0], [77.2, 159.0], [77.3, 159.0], [77.4, 160.0], [77.5, 160.0], [77.6, 161.0], [77.7, 161.0], [77.8, 162.0], [77.9, 163.0], [78.0, 163.0], [78.1, 164.0], [78.2, 165.0], [78.3, 166.0], [78.4, 167.0], [78.5, 167.0], [78.6, 168.0], [78.7, 169.0], [78.8, 170.0], [78.9, 171.0], [79.0, 172.0], [79.1, 174.0], [79.2, 175.0], [79.3, 176.0], [79.4, 178.0], [79.5, 179.0], [79.6, 181.0], [79.7, 182.0], [79.8, 184.0], [79.9, 186.0], [80.0, 187.0], [80.1, 189.0], [80.2, 191.0], [80.3, 193.0], [80.4, 195.0], [80.5, 197.0], [80.6, 200.0], [80.7, 202.0], [80.8, 204.0], [80.9, 206.0], [81.0, 208.0], [81.1, 209.0], [81.2, 211.0], [81.3, 212.0], [81.4, 213.0], [81.5, 215.0], [81.6, 215.0], [81.7, 216.0], [81.8, 217.0], [81.9, 218.0], [82.0, 219.0], [82.1, 220.0], [82.2, 220.0], [82.3, 221.0], [82.4, 222.0], [82.5, 222.0], [82.6, 223.0], [82.7, 223.0], [82.8, 224.0], [82.9, 224.0], [83.0, 224.0], [83.1, 225.0], [83.2, 225.0], [83.3, 226.0], [83.4, 226.0], [83.5, 226.0], [83.6, 227.0], [83.7, 227.0], [83.8, 227.0], [83.9, 228.0], [84.0, 228.0], [84.1, 228.0], [84.2, 229.0], [84.3, 229.0], [84.4, 229.0], [84.5, 230.0], [84.6, 230.0], [84.7, 230.0], [84.8, 231.0], [84.9, 231.0], [85.0, 231.0], [85.1, 231.0], [85.2, 232.0], [85.3, 232.0], [85.4, 232.0], [85.5, 232.0], [85.6, 233.0], [85.7, 233.0], [85.8, 233.0], [85.9, 234.0], [86.0, 234.0], [86.1, 234.0], [86.2, 234.0], [86.3, 235.0], [86.4, 235.0], [86.5, 235.0], [86.6, 235.0], [86.7, 236.0], [86.8, 236.0], [86.9, 236.0], [87.0, 236.0], [87.1, 236.0], [87.2, 237.0], [87.3, 237.0], [87.4, 237.0], [87.5, 237.0], [87.6, 238.0], [87.7, 238.0], [87.8, 238.0], [87.9, 238.0], [88.0, 239.0], [88.1, 239.0], [88.2, 239.0], [88.3, 239.0], [88.4, 240.0], [88.5, 240.0], [88.6, 240.0], [88.7, 240.0], [88.8, 240.0], [88.9, 241.0], [89.0, 241.0], [89.1, 241.0], [89.2, 241.0], [89.3, 242.0], [89.4, 242.0], [89.5, 242.0], [89.6, 242.0], [89.7, 243.0], [89.8, 243.0], [89.9, 243.0], [90.0, 243.0], [90.1, 244.0], [90.2, 244.0], [90.3, 244.0], [90.4, 244.0], [90.5, 245.0], [90.6, 245.0], [90.7, 245.0], [90.8, 245.0], [90.9, 246.0], [91.0, 246.0], [91.1, 246.0], [91.2, 247.0], [91.3, 247.0], [91.4, 247.0], [91.5, 247.0], [91.6, 248.0], [91.7, 248.0], [91.8, 248.0], [91.9, 249.0], [92.0, 249.0], [92.1, 249.0], [92.2, 250.0], [92.3, 250.0], [92.4, 250.0], [92.5, 251.0], [92.6, 251.0], [92.7, 251.0], [92.8, 252.0], [92.9, 252.0], [93.0, 252.0], [93.1, 253.0], [93.2, 253.0], [93.3, 253.0], [93.4, 254.0], [93.5, 254.0], [93.6, 255.0], [93.7, 255.0], [93.8, 256.0], [93.9, 256.0], [94.0, 257.0], [94.1, 257.0], [94.2, 258.0], [94.3, 258.0], [94.4, 259.0], [94.5, 260.0], [94.6, 260.0], [94.7, 261.0], [94.8, 261.0], [94.9, 262.0], [95.0, 263.0], [95.1, 264.0], [95.2, 265.0], [95.3, 266.0], [95.4, 267.0], [95.5, 268.0], [95.6, 270.0], [95.7, 271.0], [95.8, 273.0], [95.9, 274.0], [96.0, 277.0], [96.1, 279.0], [96.2, 282.0], [96.3, 285.0], [96.4, 289.0], [96.5, 294.0], [96.6, 300.0], [96.7, 306.0], [96.8, 312.0], [96.9, 318.0], [97.0, 323.0], [97.1, 327.0], [97.2, 330.0], [97.3, 333.0], [97.4, 335.0], [97.5, 337.0], [97.6, 339.0], [97.7, 341.0], [97.8, 343.0], [97.9, 344.0], [98.0, 345.0], [98.1, 347.0], [98.2, 349.0], [98.3, 351.0], [98.4, 352.0], [98.5, 354.0], [98.6, 356.0], [98.7, 358.0], [98.8, 360.0], [98.9, 362.0], [99.0, 365.0], [99.1, 368.0], [99.2, 373.0], [99.3, 378.0], [99.4, 386.0], [99.5, 404.0], [99.6, 432.0], [99.7, 449.0], [99.8, 462.0], [99.9, 484.0]], "isOverall": false, "label": "号源查询请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 2.0, "minX": 0.0, "maxY": 123271.0, "series": [{"data": [[0.0, 89106.0], [300.0, 7602.0], [600.0, 24.0], [700.0, 2.0], [100.0, 123271.0], [200.0, 42157.0], [400.0, 1162.0], [800.0, 2.0], [500.0, 173.0]], "isOverall": false, "label": "号源查询请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 800.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 196.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 263303.0, "series": [{"data": [[0.0, 263303.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 196.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 12.321428571428566, "minX": 1.77451038E12, "maxY": 200.0, "series": [{"data": [[1.7745105E12, 200.0], [1.77451038E12, 12.321428571428566], [1.77451056E12, 199.761830043769], [1.77451044E12, 162.3285871501353]], "isOverall": false, "label": "基线测试", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77451056E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 4.505617977528091, "minX": 1.0, "maxY": 175.84924623115575, "series": [{"data": [[2.0, 4.77049180327869], [3.0, 4.505617977528091], [4.0, 4.7563025210084025], [5.0, 4.698630136986301], [6.0, 5.349693251533741], [7.0, 6.5131578947368425], [8.0, 8.569444444444448], [9.0, 10.34756097560976], [10.0, 8.957317073170733], [11.0, 13.728915662650602], [12.0, 10.590062111801242], [13.0, 9.668224299065425], [14.0, 11.987500000000004], [15.0, 10.676855895196505], [16.0, 10.19262295081967], [17.0, 12.823529411764705], [18.0, 13.70334928229665], [19.0, 16.183246073298424], [20.0, 12.969565217391297], [21.0, 16.64285714285715], [22.0, 18.433526011560694], [23.0, 22.033149171270715], [24.0, 18.758620689655167], [25.0, 19.27722772277229], [26.0, 18.700483091787437], [27.0, 20.955000000000005], [28.0, 22.29611650485437], [29.0, 22.819587628865992], [30.0, 20.77251184834122], [31.0, 22.038251366120225], [32.0, 26.258706467661703], [33.0, 27.005291005291006], [34.0, 26.67222222222223], [35.0, 24.919642857142854], [36.0, 25.211267605633818], [37.0, 28.019607843137244], [38.0, 29.98550724637682], [39.0, 31.76404494382022], [40.0, 35.28048780487807], [41.0, 37.89090909090909], [42.0, 29.84951456310679], [43.0, 32.01913875598085], [44.0, 35.142045454545475], [45.0, 35.62621359223305], [46.0, 37.59162303664918], [47.0, 37.8742857142857], [48.0, 37.51923076923078], [49.0, 40.12041884816754], [50.0, 38.563218390804614], [51.0, 43.91124260355028], [52.0, 47.21556886227544], [53.0, 52.499999999999986], [54.0, 43.920212765957416], [55.0, 44.652173913043484], [56.0, 52.064327485380126], [57.0, 44.69892473118281], [58.0, 41.81165919282512], [59.0, 40.43809523809524], [60.0, 43.51569506726453], [61.0, 45.093264248704635], [62.0, 47.05797101449274], [63.0, 42.27802690582962], [64.0, 42.241071428571445], [65.0, 46.36559139784944], [66.0, 53.93236714975847], [67.0, 51.583756345177676], [68.0, 45.28085106382977], [69.0, 45.16894977168952], [70.0, 46.89830508474578], [71.0, 48.404145077720216], [72.0, 56.454106280193244], [73.0, 47.65437788018434], [74.0, 49.57983193277309], [75.0, 44.54545454545454], [76.0, 49.75324675324678], [77.0, 50.23451327433629], [78.0, 48.7541666666667], [79.0, 58.795238095238126], [80.0, 54.55752212389381], [81.0, 49.94298245614037], [82.0, 57.28048780487806], [83.0, 52.22580645161286], [84.0, 54.29914529914529], [85.0, 55.033613445378144], [86.0, 63.270270270270245], [87.0, 60.31168831168832], [88.0, 54.99183673469387], [89.0, 64.5051546391752], [90.0, 71.00540540540541], [91.0, 84.58823529411765], [92.0, 66.99290780141845], [93.0, 96.24999999999999], [94.0, 93.41333333333333], [95.0, 91.6306818181818], [96.0, 89.2357142857143], [97.0, 104.38666666666664], [98.0, 75.72413793103449], [99.0, 76.22885572139309], [100.0, 75.50251256281406], [101.0, 72.07462686567166], [102.0, 63.67213114754099], [103.0, 64.53389830508478], [104.0, 66.86160714285714], [105.0, 69.89711934156378], [106.0, 68.35294117647061], [107.0, 68.75943396226415], [108.0, 72.96995708154509], [109.0, 72.82589285714288], [110.0, 72.7539682539683], [111.0, 64.00411522633743], [112.0, 78.8468899521531], [113.0, 79.6792452830189], [114.0, 76.11415525114157], [115.0, 77.43426294820716], [116.0, 73.50917431192663], [117.0, 75.77489177489177], [118.0, 73.33191489361703], [119.0, 85.39285714285704], [120.0, 98.08441558441555], [121.0, 91.8820754716981], [122.0, 82.93133047210299], [123.0, 79.14220183486236], [124.0, 81.95067264573991], [125.0, 72.12083333333332], [126.0, 89.49541284403671], [127.0, 98.2304147465438], [128.0, 76.90366972477062], [129.0, 88.73777777777778], [130.0, 85.4636363636363], [131.0, 88.24568965517237], [132.0, 90.61904761904759], [133.0, 84.3392857142858], [134.0, 86.92241379310349], [135.0, 89.41333333333337], [136.0, 93.6093023255814], [137.0, 88.64853556485355], [138.0, 83.70833333333334], [139.0, 90.73443983402494], [140.0, 89.6651982378855], [141.0, 89.63636363636365], [142.0, 92.44725738396629], [143.0, 104.91999999999997], [144.0, 89.9316239316239], [145.0, 98.36888888888889], [146.0, 92.97356828193836], [147.0, 97.22314049586775], [148.0, 94.13901345291481], [149.0, 90.29999999999998], [150.0, 105.28318584070793], [151.0, 98.31034482758618], [152.0, 100.98245614035095], [153.0, 95.83870967741932], [154.0, 105.23076923076931], [155.0, 102.60619469026547], [156.0, 96.76086956521743], [157.0, 108.6515837104072], [158.0, 104.1583333333333], [159.0, 105.7973568281938], [160.0, 106.96803652968028], [161.0, 106.08547008547002], [162.0, 104.29957805907173], [163.0, 101.5152838427947], [164.0, 101.6205357142857], [165.0, 110.8290598290598], [166.0, 107.97854077253221], [167.0, 131.39215686274517], [168.0, 100.97991967871481], [169.0, 96.52916666666665], [170.0, 117.08658008658021], [171.0, 118.95391705069126], [172.0, 103.43043478260867], [173.0, 127.43601895734601], [174.0, 106.70040485829963], [175.0, 112.55882352941173], [176.0, 116.13716814159291], [177.0, 115.07339449541284], [178.0, 127.41013824884794], [179.0, 112.82242990654204], [180.0, 129.59051724137927], [181.0, 107.905737704918], [182.0, 116.97071129707119], [183.0, 114.12558139534887], [184.0, 124.58695652173913], [185.0, 123.15458937198065], [186.0, 139.39906103286395], [187.0, 136.73214285714283], [188.0, 110.29482071713149], [189.0, 113.18987341772149], [190.0, 134.49999999999994], [191.0, 125.4518828451883], [192.0, 159.1102362204724], [193.0, 175.84924623115575], [194.0, 140.42452830188682], [195.0, 139.5261044176706], [196.0, 123.73553719008265], [197.0, 123.28514056224898], [198.0, 133.02479338842974], [199.0, 125.95305164319251], [200.0, 134.4633038682975], [1.0, 48.0]], "isOverall": false, "label": "号源查询请求-基线", "isController": false}, {"data": [[185.02874773718148, 124.61256399454881]], "isOverall": false, "label": "号源查询请求-基线-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 200.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 18729.666666666668, "minX": 1.77451038E12, "maxY": 2.353395385E7, "series": [{"data": [[1.7745105E12, 2.333666255E7], [1.77451038E12, 861082.1666666666], [1.77451056E12, 2.262796605E7], [1.77451044E12, 2.353395385E7]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7745105E12, 508231.25], [1.77451038E12, 18729.666666666668], [1.77451056E12, 493038.11666666664], [1.77451044E12, 512686.81666666665]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77451056E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 9.440683229813656, "minX": 1.77451038E12, "maxY": 136.50529327610812, "series": [{"data": [[1.7745105E12, 136.50529327610812], [1.77451038E12, 9.440683229813656], [1.77451056E12, 134.13528308341978], [1.77451044E12, 107.87293087212353]], "isOverall": false, "label": "号源查询请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77451056E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 9.023602484472054, "minX": 1.77451038E12, "maxY": 133.3079484978572, "series": [{"data": [[1.7745105E12, 133.3079484978572], [1.77451038E12, 9.023602484472054], [1.77451056E12, 131.53366445264953], [1.77451044E12, 105.67752805164423]], "isOverall": false, "label": "号源查询请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77451056E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 9.320104290787185E-4, "minX": 1.77451038E12, "maxY": 0.007453416149068342, "series": [{"data": [[1.7745105E12, 0.0013047210300429221], [1.77451038E12, 0.007453416149068342], [1.77451056E12, 9.320104290787185E-4], [1.77451044E12, 0.0015770186405872383]], "isOverall": false, "label": "号源查询请求-基线", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77451056E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 2.0, "minX": 1.77451038E12, "maxY": 839.0, "series": [{"data": [[1.7745105E12, 839.0], [1.77451038E12, 33.0], [1.77451056E12, 829.0], [1.77451044E12, 686.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7745105E12, 260.0], [1.77451038E12, 15.0], [1.77451056E12, 244.0], [1.77451044E12, 243.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7745105E12, 391.0], [1.77451038E12, 22.789999999999964], [1.77451056E12, 364.0], [1.77451044E12, 362.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7745105E12, 298.0], [1.77451038E12, 17.0], [1.77451056E12, 261.0], [1.77451044E12, 259.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.7745105E12, 4.0], [1.77451038E12, 2.0], [1.77451056E12, 3.0], [1.77451044E12, 3.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7745105E12, 139.0], [1.77451038E12, 9.0], [1.77451056E12, 129.0], [1.77451044E12, 129.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77451056E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 5.0, "minX": 190.0, "maxY": 162.0, "series": [{"data": [[190.0, 129.0], [678.0, 5.0], [1105.0, 9.0], [1192.0, 40.0], [1164.0, 79.0], [1191.0, 117.0], [1155.0, 162.0], [1264.0, 18.0], [1270.0, 33.0], [1218.0, 69.0], [1259.0, 126.0], [1222.0, 159.0], [1275.0, 148.0], [1229.0, 158.0], [1223.0, 149.0], [1258.0, 121.0], [1300.0, 22.0], [1310.0, 27.0], [1307.0, 58.0], [1329.0, 136.0], [1331.0, 135.0], [1332.0, 148.0], [1294.0, 149.0], [1288.0, 150.0], [1356.0, 137.0], [1372.0, 57.0], [1359.0, 129.0], [1405.0, 140.0], [1406.0, 142.0], [1389.0, 141.0], [1390.0, 138.0], [1387.0, 138.0], [1357.0, 140.0], [1399.0, 135.0], [1402.0, 136.0], [1393.0, 134.0], [1369.0, 139.0], [1352.0, 139.0], [1351.0, 141.0], [1367.0, 139.0], [1463.0, 134.0], [1449.0, 76.0], [1437.0, 11.0], [1436.0, 134.0], [1428.0, 138.0], [1431.0, 132.0], [1450.0, 46.0], [1455.0, 130.0], [1439.0, 135.0], [1458.0, 136.0], [1459.0, 135.0], [1465.0, 134.0], [1444.0, 136.0], [1440.0, 136.0], [1452.0, 134.0], [1527.0, 66.0], [1506.0, 71.0], [1526.0, 128.0], [1525.0, 128.0], [1524.0, 128.0], [1520.0, 128.0], [1523.0, 129.0], [1521.0, 130.0], [1522.0, 129.0], [1499.0, 130.0], [1502.0, 130.0], [1487.0, 133.0], [1486.0, 135.0], [1475.0, 134.0], [1480.0, 131.0], [1481.0, 132.0], [1485.0, 132.0], [1529.0, 129.0], [1528.0, 129.0], [1531.0, 129.0], [1504.0, 129.0], [1535.0, 129.0], [1534.0, 129.0], [1532.0, 128.0], [1533.0, 127.0], [1530.0, 129.0], [1511.0, 70.0], [1509.0, 131.0], [1497.0, 101.0], [1495.0, 99.0], [1519.0, 125.0], [1516.0, 129.0], [1517.0, 129.0], [1518.0, 130.0], [1515.0, 125.0], [1514.0, 105.0], [1513.0, 129.0], [1512.0, 128.0], [1489.0, 119.0], [1491.0, 131.0], [1494.0, 129.0], [1538.0, 124.0], [1543.0, 120.0], [1537.0, 121.0], [1536.0, 128.0], [1544.0, 128.0], [1547.0, 128.0], [1556.0, 127.0], [1553.0, 127.0], [1552.0, 127.0], [1558.0, 127.0], [1541.0, 128.0], [1542.0, 128.0], [1539.0, 129.0], [1551.0, 128.0], [1550.0, 129.0], [1548.0, 128.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1558.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 5.0, "minX": 190.0, "maxY": 157.0, "series": [{"data": [[190.0, 128.5], [678.0, 5.0], [1105.0, 8.0], [1192.0, 38.0], [1164.0, 73.0], [1191.0, 112.0], [1155.0, 157.0], [1264.0, 17.0], [1270.0, 31.0], [1218.0, 64.0], [1259.0, 124.0], [1222.0, 145.0], [1275.0, 142.0], [1229.0, 147.0], [1223.0, 146.0], [1258.0, 120.0], [1300.0, 21.0], [1310.0, 25.0], [1307.0, 53.0], [1329.0, 133.0], [1331.0, 132.0], [1332.0, 134.0], [1294.0, 146.0], [1288.0, 147.0], [1356.0, 131.0], [1372.0, 53.5], [1359.0, 127.0], [1405.0, 138.0], [1406.0, 140.0], [1389.0, 135.0], [1390.0, 134.5], [1387.0, 134.0], [1357.0, 136.0], [1399.0, 133.0], [1402.0, 134.0], [1393.0, 131.0], [1369.0, 134.0], [1352.0, 137.0], [1351.0, 137.0], [1367.0, 135.0], [1463.0, 132.0], [1449.0, 74.0], [1437.0, 10.0], [1436.0, 131.0], [1428.0, 135.0], [1431.0, 130.0], [1450.0, 45.0], [1455.0, 128.0], [1439.0, 133.0], [1458.0, 134.0], [1459.0, 134.0], [1465.0, 133.0], [1444.0, 135.0], [1440.0, 133.5], [1452.0, 133.0], [1527.0, 64.0], [1506.0, 68.0], [1526.0, 127.0], [1525.0, 127.0], [1524.0, 127.0], [1520.0, 127.0], [1523.0, 127.0], [1521.0, 128.0], [1522.0, 127.0], [1499.0, 129.0], [1502.0, 129.0], [1487.0, 131.0], [1486.0, 133.0], [1475.0, 132.0], [1480.0, 128.0], [1481.0, 131.0], [1485.0, 129.0], [1529.0, 127.0], [1528.0, 127.0], [1531.0, 127.0], [1504.0, 128.0], [1535.0, 127.0], [1534.0, 127.0], [1532.0, 127.0], [1533.0, 126.0], [1530.0, 127.0], [1511.0, 68.0], [1509.0, 129.0], [1497.0, 99.0], [1495.0, 95.0], [1519.0, 124.0], [1516.0, 127.0], [1517.0, 128.0], [1518.0, 128.0], [1515.0, 124.0], [1514.0, 103.0], [1513.0, 127.0], [1512.0, 125.0], [1489.0, 117.0], [1491.0, 128.0], [1494.0, 127.0], [1538.0, 122.0], [1543.0, 119.0], [1537.0, 120.0], [1536.0, 127.0], [1544.0, 126.0], [1547.0, 126.0], [1556.0, 125.0], [1553.0, 125.0], [1552.0, 125.0], [1558.0, 126.0], [1541.0, 127.0], [1542.0, 127.0], [1539.0, 128.0], [1551.0, 126.0], [1550.0, 127.0], [1548.0, 126.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1558.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 54.016666666666666, "minX": 1.77451038E12, "maxY": 1472.0, "series": [{"data": [[1.7745105E12, 1456.2333333333333], [1.77451038E12, 54.016666666666666], [1.77451056E12, 1409.4], [1.77451044E12, 1472.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77451056E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 53.666666666666664, "minX": 1.77451038E12, "maxY": 1469.0166666666667, "series": [{"data": [[1.7745105E12, 1456.25], [1.77451038E12, 53.666666666666664], [1.77451056E12, 1412.7166666666667], [1.77451044E12, 1469.0166666666667]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.77451056E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 53.666666666666664, "minX": 1.77451038E12, "maxY": 1469.0166666666667, "series": [{"data": [[1.7745105E12, 1456.25], [1.77451038E12, 53.666666666666664], [1.77451056E12, 1412.7166666666667], [1.77451044E12, 1469.0166666666667]], "isOverall": false, "label": "号源查询请求-基线-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77451056E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 53.666666666666664, "minX": 1.77451038E12, "maxY": 1469.0166666666667, "series": [{"data": [[1.7745105E12, 1456.25], [1.77451038E12, 53.666666666666664], [1.77451056E12, 1412.7166666666667], [1.77451044E12, 1469.0166666666667]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.77451056E12, "title": "Total Transactions Per Second"}},
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

