import 'package:flutter/material.dart';

import '../generated/l10n.dart';

class DropdownList extends StatefulWidget {
  final List<dynamic> children;
  final Function(List<dynamic>) changeChildren;
  const DropdownList(
      {super.key, required this.children, required this.changeChildren});

  @override
  DropdownListState createState() => DropdownListState();
}

class DropdownListState extends State<DropdownList> {
  List<dynamic> items = [];
  late Function(List<dynamic>) changeItems;

  @override
  void initState() {
    super.initState();
    items = widget.children;
    changeItems = widget.changeChildren;
  }

  @override
  void didUpdateWidget(DropdownList oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.children != oldWidget.children) {
      setState(() {
        items = widget.children;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          S.of(context).mode,
        ),
        const SizedBox(height: 10),
        Column(
          children: List.generate(items.length, (index) {
            return Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: items[index]["section"],
                    // ignore: prefer_const_literals_to_create_immutables
                    items: [
                      DropdownMenuItem(
                        value: 'Vaginal Delivery',
                        child: Text(S.of(context).vaginal_delivery),
                      ),
                      DropdownMenuItem(
                        value: 'Cesarean Surgery',
                        child: Text(S.of(context).cesarean_surgery),
                      ),
                    ],
                    onChanged: (value) {
                      items[index] = {"section": value};
                      changeItems(items);
                    },
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {
                    items.removeAt(index);
                    changeItems(items);
                  },
                ),
              ],
            );
          }).toList(),
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {
            items.add({'section': 'Vaginal Delivery'});
            changeItems(items);
          },
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(double.infinity, 48),
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(10)),
            ),
          ),
          child: Text(S.of(context).add_child),
        ),
      ],
    );
  }
}
